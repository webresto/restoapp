# metrics — Prometheus exporter

The hook serves `GET /metrics` in the Prometheus text exposition format
(`prom-client`). `@webresto/core` is not patched: every business number comes
from events the core already emits (`emitter`) and from read-only aggregate
queries.

---

## Enabling it

The endpoint stays **off until a strong `METRICS_TOKEN` is set**. nginx inside
the container proxies `location /` to the app, so `/metrics` is reachable from
the internet — and the exposition carries revenue, order volume, notification
cost and the running commit. None of that may be served anonymously.

```bash
# in the stack .env (or extra_env in restoapp-infra/stacks/<stack>.yml)
METRICS_TOKEN=$(openssl rand -hex 32)
STACK_NAME=gfcafe          # becomes the `stack` label on every series
```

Check:

```bash
curl -s -H "Authorization: Bearer $METRICS_TOKEN" http://127.0.0.1:42880/metrics | head
```

### Environment variables

| Variable | Default | Purpose |
|---|---|---|
| `METRICS_TOKEN` | — | Scrape token. Below 64 bits of entropy the endpoint refuses to start. |
| `METRICS_ENABLED` | `true` | Kill switch: `false` disables the endpoint even with a valid token. |
| `METRICS_PATH` | `/metrics` | Endpoint path. |
| `METRICS_DB_INTERVAL` | `30` | Database gauge refresh, seconds. `0` disables the DB collector. |
| `METRICS_RUNTIME_INTERVAL` | `15` | Heap/disk/emitter-subscriber refresh, seconds. |
| `METRICS_WINDOW_HOURS` | `24` | Rolling window for order/payment/notification gauges. |
| `METRICS_DISK_PATHS` | `process.cwd()` | Comma-separated filesystems to report free space for. |
| `METRICS_DEFAULT_METRICS` | `true` | Standard `process_*` / `nodejs_*` metrics. |
| `METRICS_MAX_GRAPHQL_OPERATIONS` | `60` | Cap on distinct GraphQL operation names; the rest collapse into `other`. |
| `STACK_NAME` | `unknown` | The `stack` label — one Prometheus, many stacks. |

### Security

- the token is accepted **in a header only** (`Authorization: Bearer …` or
  `X-Metrics-Key`), never in a query string: query strings end up in the nginx
  access log and in every proxy along the way;
- comparison is constant-time over SHA-256 digests;
- an unauthorised request gets a bare `401` with no body — nothing to fingerprint;
- no order ids, user ids or phone numbers appear in labels. Rule for new
  metrics: a label value must come from a closed set (order states, channel
  names, status codes), otherwise it is both a cardinality bomb and a way to
  leak customer data through an internet-facing endpoint.

### Example scrape_config

```yaml
scrape_configs:
  - job_name: restoapp
    scrape_interval: 30s
    metrics_path: /metrics
    authorization:
      credentials: <stack METRICS_TOKEN>
    static_configs:
      - targets: ['gfcafe.ru:443']
        labels: { stack: gfcafe, env: prod }
    scheme: https
```

Each stack has its own token, so each stack needs its own job (or
`file_sd_configs` with per-target `authorization`).

---

## What is exported, and what to react to

### Process runtime — "why did it restart"

| Metric | Meaning |
|---|---|
| `restoapp_heap_used_ratio` | used heap / heap limit. Above `0.9` for five minutes means an OOM is minutes away. |
| `restoapp_heap_limit_bytes` | V8 heap limit (useful when changing `--max-old-space-size`). |
| `nodejs_heap_size_used_bytes`, `nodejs_gc_duration_seconds` | Standard V8 metrics. |
| `nodejs_eventloop_lag_p99_seconds` | The app is stalling (sync code, GC storms). |
| `process_start_time_seconds` | A jump means the process restarted under pm2 — while the container itself stayed `Up`. |
| `restoapp_emitter_subscribers{event}` | Subscribers per core event. Monotonic growth is a listener leak. |
| `restoapp_process_warnings_total{name}` | Includes `MaxListenersExceededWarning` — the precursor to the 2026-07-18 heap OOM. |
| `restoapp_unhandled_errors_total{kind}` | Unhandled rejections and uncaught exceptions. |
| `restoapp_http_open_connections` | Open TCP connections (keep-alive plus GraphQL websocket subscriptions). |

### Server errors — "how many, and where from"

| Metric | Meaning |
|---|---|
| `restoapp_log_errors_total{source}` | Every `sails.log.error`, attributed to a subsystem: `graphql`, `order`, `payment`, `notification`, `rms`, `promotion`, `admin`, `nodered`, `openharness`, `mcp`, `database`, `bootstrap`, `other`. This is the headline "how many server errors" number. |
| `restoapp_last_error_timestamp_seconds{source}` | When each subsystem last failed — for lining errors up with an incident window. |
| `restoapp_http_server_errors_total{route,status}` | 5xx responses by route class. |
| `restoapp_http_client_disconnects_total{route}` | Clients that hung up before the response finished (timeouts, mobile networks). |
| `restoapp_unhandled_errors_total{kind}` | Unhandled rejection / uncaught exception. |

GraphQL errors land here automatically: `@webresto/graphql` logs every one of
them through `sails.log.error('GraphQL Error:', …)` → `source="graphql"`.

### Logs and database — "code problem or infrastructure problem"

| Metric | Meaning |
|---|---|
| `restoapp_log_messages_total{level}` | Rate of `sails.log.error/warn`. A spike is a crash loop. |
| `restoapp_db_errors_total{kind}` | `missing_column` / `missing_relation` (half-applied migration, see `docs/crashloop-missing-column.md`), `connection` (`EAI_AGAIN postgres`), `disk_full`, `deadlock`, `timeout`. |
| `restoapp_db_up`, `restoapp_db_ping_duration_seconds` | Datastore reachability from inside the app. |
| `restoapp_db_size_bytes`, `restoapp_db_connections{state}` | Database growth and busy backends. |
| `restoapp_disk_free_bytes{path}` | Free space (the 2026-06-13 and 2026-06-20 incidents were disks at 100%). |

### HTTP and GraphQL

| Metric | Meaning |
|---|---|
| `restoapp_http_requests_total{route,method,status}` | Route classes: `graphql`, `admin`, `admin-api`, `mcp`, `nodered`, `health`, `static`, `spa`, `other`. |
| `restoapp_http_request_duration_seconds` | Histogram, same labels minus `status`. |
| `restoapp_http_requests_in_flight{route}` | Concurrent requests; growth on a healthy process means something is not releasing. |
| `restoapp_http_response_bytes_total{route}` | Bytes returned (from `Content-Length`) — traffic volume and menu payload bloat. |
| `restoapp_graphql_operations_total{operation,status}` | Operations by `operationName`, capped at 60 distinct names. |
| `restoapp_graphql_operation_duration_seconds{operation}` | Storefront latency. |

### Load by device

| Metric | Meaning |
|---|---|
| `restoapp_active_devices{window}` | Unique `X-Device-Id` values in live traffic over 5 minutes and 1 hour. This is "how many devices are active right now". |
| `restoapp_device_requests_total{route}` | Requests carrying a device id (storefront and app clients). |
| `restoapp_anonymous_requests_total{route}` | Requests without one: bots, crawlers, server-to-server, admin panel. |
| `restoapp_devices_total`, `restoapp_devices_logged_in` | Registered devices in the database. |
| `restoapp_devices_active{window}` | From `UserDevice.lastActivity`, windows `1h` and `24h`. **This is not traffic**: the field is only written on login and session checks, and the column is `real`, which loses precision at epoch-ms scale — anything shorter than an hour would be noise. For load, use `restoapp_active_devices`. |
| `restoapp_devices_with_push_token{platform}` | How many devices are reachable by push at all (ios/android/web). |

The unique-device counter lives in process memory: the map is capped at 50 000
entries and evicts the least recently seen, so the metric can undercount but
cannot grow without bound. A process restart resets the count.

### Orders — the primary business signal

| Metric | Meaning |
|---|---|
| `restoapp_orders_created_total` / `restoapp_orders_checkout_total` / `restoapp_orders_placed_total{self_service,platform}` | The funnel: cart → checkout → order. A broken conversion shows up as the rates diverging. |
| `restoapp_orders_amount_total{platform}` | Order totals at placement → revenue per minute via `rate()`. |
| `restoapp_order_state_transitions_total{from,to}` | State transitions, including `to="REJECT"`. |
| `restoapp_order_log_total{level,module}` | Volume of order log entries (all levels). |
| `restoapp_orders_in_state{state}` | Orders per state inside the window. |
| `restoapp_orders_oldest_age_seconds{state}` | Age of the oldest stuck order — the `ORDER`/`COOKING` backlog case (journal 2026-06-15). |
| `restoapp_last_order_placed_timestamp_seconds` | Time of the last order: more reliable than `rate()` on low traffic. |

### Order failures — what reaches the order log

| Metric | Meaning |
|---|---|
| `restoapp_order_errors_total{level,module,op}` | Every `error`/`warn` entry in an order log. `op` is the operation taken from the core's message prefix: `check`, `countCart`, `addDish`, `order`, `payment`, `doPaid`, `populate`, `setTag`. |
| `restoapp_order_errors_total{op="money_in_no_order"}` | Dedicated label for `!!! CRITICAL: MONEY-IN, ORDER-NOT-PLACED !!!` — money arrived, no order placed. Alert at zero. |
| `restoapp_order_rejects_total{reason}` | Refusals the core handles silently (they never reach a log line): `add_dish_amount` (out of stock), `set_count_amount`, `remove_dish_missing`, `set_count_missing`, `set_comment_missing`, `dopaid_failed`. |
| `restoapp_notification_log_total{level,module}` | Notification delivery trace; `level="error"` is a channel refusing the message (SMS 400, FCM "no channel"). |

Reading `op` — where it broke: `check` — checkout fails validation, `countCart`
— the cart will not recalculate (promotions, delivery, modifiers), `order` — RMS
rejected the order, `payment` — payment registration failed, `doPaid` — failure
after the money arrived.

### Sales channels

| Metric | Meaning |
|---|---|
| `restoapp_orders_by_channel{channel,placed}` | Orders in the window per channel. `placed="true"` counts those that reached `ORDER`/`COOKING`/`ON_THE_WAY`/`DONE`, `placed="false"` counts all of them including abandoned carts. The channel is resolved through `SalesChannel.key` and `SalesChannel.platforms`. |
| `restoapp_orders_by_platform{platform}` | Raw `Order.orderedOnPlatform` — shows values no channel claims (they add up as `channel="unmapped"` in `orders_by_channel`). |
| `restoapp_orders_placed_total{platform}`, `restoapp_orders_amount_total{platform}` | Live placement and revenue counters per platform. |
| `restoapp_sales_channels{status,enabled}` | How many channels are configured and in what state (`ready`/`needs_setup`/`error`/…). |

### Payments

`restoapp_payments_initiated_total`, `restoapp_payments_checked_total`,
`restoapp_payments_paid_total`, `restoapp_payments_cancelled_total`,
`restoapp_payments_in_status{status}`, `restoapp_payments_pending_oldest_seconds`.

React when: `initiated` keeps growing while `paid` does not; `pending_oldest`
exceeds an hour.

### Menu and RMS sync (iiko)

| Metric | Meaning |
|---|---|
| `restoapp_rms_sync_last_success_timestamp_seconds{type}` | `products`, `out_of_stocks`. A menu that stopped syncing is visible immediately. |
| `restoapp_rms_sync_items{type}` | Size of the last run: "the sync succeeded with 0 items" is also an outage. |
| `restoapp_rms_sync_last_duration_seconds{type}` | Duration of the last run. |
| `restoapp_menu_dishes{state}` | `total` / `visible` / `out_of_stock`. A collapse in `visible` means the menu got wiped. |
| `restoapp_menu_groups` | Visible menu groups. |

### Notifications

`restoapp_notifications_created_total{type}`,
`restoapp_notifications_in_status{status}` (`pending`/`processing`/`sent`/`failed`/`read`/`cancelled`),
`restoapp_notifications_cost_window` — sum of `spentCost` over the window (SMS costs real money).

React when: the `failed` share grows, messages pile up in `pending`/`processing`,
or the cost jumps.

### Readiness and housekeeping

`restoapp_ready` (the `/readyz` check: at least one enabled sales channel),
`restoapp_maintenance_enabled`, `restoapp_build_info{version,commit,branch,node,staging}`,
`restoapp_bootstrap_completed`, `restoapp_collector_duration_seconds{collector}`,
`restoapp_collector_errors_total{collector}` — the exporter also watches itself.

---

## PromQL starting points

```promql
# OOM is close
restoapp_heap_used_ratio > 0.9

# the process restarted (pm2 inside a container that never went down)
changes(process_start_time_seconds{job="restoapp"}[15m]) > 0

# a core event is leaking subscribers
delta(restoapp_emitter_subscribers[1h]) > 50

# no orders for 30 minutes (during opening hours)
time() - restoapp_last_order_placed_timestamp_seconds > 1800

# an order has been sitting in COOKING for over half an hour
restoapp_orders_oldest_age_seconds{state="COOKING"} > 1800

# payments start but never complete
rate(restoapp_payments_initiated_total[15m]) > 0
  and rate(restoapp_payments_paid_total[30m]) == 0

# the menu has not synced for two hours
time() - restoapp_rms_sync_last_success_timestamp_seconds{type="products"} > 7200

# the database schema drifted away from the code (broken migration)
increase(restoapp_db_errors_total{kind=~"missing_column|missing_relation"}[10m]) > 0

# running out of disk
restoapp_disk_free_bytes / restoapp_disk_total_bytes < 0.1

# 5xx on the storefront
sum by (route) (rate(restoapp_http_server_errors_total[5m])) > 0

# server errors per minute, by subsystem
sum by (source) (rate(restoapp_log_errors_total[5m])) * 60

# order failures: where exactly things break
topk(5, sum by (op) (rate(restoapp_order_errors_total{level="error"}[15m])))

# money in, no order — react immediately
increase(restoapp_order_errors_total{op="money_in_no_order"}[1h]) > 0

# share of orders that hit an error
sum(rate(restoapp_order_errors_total{level="error"}[30m]))
  / sum(rate(restoapp_orders_created_total[30m]))

# a sales channel went quiet (orders yesterday, none today)
restoapp_orders_by_channel{placed="true"} == 0
  and restoapp_orders_by_channel{placed="true"} offset 1d > 0

# load: unique devices, and requests per device
restoapp_active_devices{window="5m"}
sum(rate(restoapp_device_requests_total[5m])) / restoapp_active_devices{window="5m"}

# clients giving up before the response arrives
sum by (route) (rate(restoapp_http_client_disconnects_total[5m])) > 0
```

---

## How it is put together

```
api/hooks/metrics/
  index.js                     hook: config → registry → middleware → collectors
  lib/config.js                env/sails.config plus the token entropy gate
  lib/registry.js              prom-client Registry and the metric catalogue
  lib/endpoint.js              GET /metrics and its authorisation
  lib/httpMetrics.js           request instrumentation, route classes
  lib/deviceActivity.js        sliding window of unique X-Device-Id values
  lib/collectors/runtime.js    heap, disk, emitter subscribers, sails.log wrapper
  lib/collectors/emitter.js    business counters from core events
  lib/collectors/database.js   periodic aggregate queries
```

Both middlewares are mounted **synchronously in `initialize`**: express runs
middleware in registration order, and anything mounted later (from an event
handler) ends up behind the `frontendRoutes` catch-all in `config/http.js` and
never runs — see the infra journal entry
`2026-07-06-gfcafe-admin-module-assets-shadowed.md`.

The registry lives on `global` for the same reason `getEmitter()` does in the
core: under `tsx` the same module can be instantiated twice, and a
module-scoped singleton would quietly split into two registries — the collectors
writing into one while `/metrics` renders the other.

Tests: `tests/metrics.test.ts` (`npm test`).

## Not covered yet

- GraphQL errors are counted from the log (`log_errors_total{source="graphql"}`),
  not from the response body, so they are not tied to an operation name. That
  would need an Apollo plugin inside `@webresto/graphql`.
- Active websocket subscriptions are not counted separately — only in aggregate
  through `restoapp_http_open_connections`.
- Devices on websocket subscriptions do not reach `restoapp_active_devices`: the
  device id arrives in the handshake, not as a header on every request.
- Host and container metrics (CPU, OOMKilled, Docker restarts) are out of scope
  here — that is `node_exporter` / `cAdvisor` territory on the host.
