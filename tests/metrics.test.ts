import { expect } from "chai";

// ---------- helpers ----------

function freshRegistry() {
  delete (global as any).__restoappMetrics;
  return require("../api/hooks/metrics/lib/registry");
}

function makeRes() {
  const res: any = {
    statusCode: 200,
    headers: {} as Record<string, string>,
    body: undefined as any,
    ended: false,
    setHeader(name: string, value: string) { this.headers[name.toLowerCase()] = value; },
    end(body?: any) { this.body = body; this.ended = true; return this; },
    on() { return this; },
  };
  return res;
}

function withEnv(vars: Record<string, string | undefined>, fn: () => void) {
  const previous: Record<string, string | undefined> = {};
  for (const key of Object.keys(vars)) {
    previous[key] = process.env[key];
    if (vars[key] === undefined) delete process.env[key];
    else process.env[key] = vars[key] as string;
  }
  try {
    fn();
  } finally {
    for (const key of Object.keys(previous)) {
      if (previous[key] === undefined) delete process.env[key];
      else process.env[key] = previous[key] as string;
    }
  }
}

// 64 hex chars — comfortably above the entropy floor.
const STRONG_TOKEN = "c9f4a1d7e2b8039461fdca75b0e3128a9d6c4f01b7e5a2938c6d0f4b1a7e9c53";

before(() => {
  (global as any).sails = (global as any).sails || {
    config: {},
    log: Object.assign(function () { }, {
      info() { }, warn() { }, error() { }, debug() { }, silly() { },
    }),
  };
});

// ---------- config gate ----------

describe("metrics hook > config", () => {
  const { getConfig, validateToken } = require("../api/hooks/metrics/lib/config");

  it("refuses to enable without a token", () => {
    withEnv({ METRICS_TOKEN: undefined, METRICS_ENABLED: undefined }, () => {
      const config = getConfig((global as any).sails);
      expect(config.enabled).to.equal(false);
      expect(config.disabledReason).to.contain("not set");
    });
  });

  it("refuses a low-entropy token", () => {
    withEnv({ METRICS_TOKEN: "metrics" }, () => {
      const config = getConfig((global as any).sails);
      expect(config.enabled).to.equal(false);
      expect(config.disabledReason).to.contain("entropy");
    });
    expect(validateToken("password123").ok).to.equal(false);
    expect(validateToken(STRONG_TOKEN).ok).to.equal(true);
  });

  it("enables with a strong token and honours the kill switch", () => {
    withEnv({ METRICS_TOKEN: STRONG_TOKEN, METRICS_ENABLED: undefined }, () => {
      expect(getConfig((global as any).sails).enabled).to.equal(true);
    });
    withEnv({ METRICS_TOKEN: STRONG_TOKEN, METRICS_ENABLED: "false" }, () => {
      const config = getConfig((global as any).sails);
      expect(config.enabled).to.equal(false);
      expect(config.disabledReason).to.contain("METRICS_ENABLED=false");
    });
  });
});

// ---------- endpoint authorisation ----------

describe("metrics hook > endpoint auth", () => {
  const endpoint = require("../api/hooks/metrics/lib/endpoint");
  const config = { token: STRONG_TOKEN, path: "/metrics" };

  const req = (headers: Record<string, string>, url = "/metrics", method = "GET") =>
    ({ method, url, headers } as any);

  it("accepts the token as a bearer header", () => {
    expect(endpoint.authorize(req({ authorization: `Bearer ${STRONG_TOKEN}` }), config)).to.equal(true);
  });

  it("accepts the token in X-Metrics-Key", () => {
    expect(endpoint.authorize(req({ "x-metrics-key": STRONG_TOKEN }), config)).to.equal(true);
  });

  it("rejects a wrong, empty or missing token", () => {
    expect(endpoint.authorize(req({ authorization: "Bearer wrong" }), config)).to.equal(false);
    expect(endpoint.authorize(req({ authorization: "Bearer " }), config)).to.equal(false);
    expect(endpoint.authorize(req({}), config)).to.equal(false);
  });

  it("never accepts the token from the query string (it lands in access logs)", async () => {
    const middleware = endpoint.middleware(config, freshRegistry().getRegistry({
      defaultLabels: {}, collectDefaultMetrics: false, buildInfo: { version: "", commit: "", branch: "", node: "", staging: "0" },
    }));
    const res = makeRes();
    await middleware(req({}, `/metrics?token=${STRONG_TOKEN}`), res, () => { throw new Error("must not fall through"); });
    expect(res.statusCode).to.equal(401);
    expect(res.body).to.equal(undefined);
    expect(res.headers["www-authenticate"]).to.contain("Bearer");
  });

  it("serves the exposition to an authorised scrape", async () => {
    const metrics = freshRegistry().getRegistry({
      defaultLabels: { stack: "test" },
      collectDefaultMetrics: false,
      buildInfo: { version: "1.2.3", commit: "deadbeef", branch: "next", node: "v22", staging: "0" },
    });
    const middleware = endpoint.middleware(config, metrics);
    const res = makeRes();
    await middleware(req({ authorization: `Bearer ${STRONG_TOKEN}` }), res, () => { throw new Error("must not fall through"); });
    expect(res.statusCode).to.equal(200);
    expect(res.headers["content-type"]).to.contain("text/plain");
    expect(res.body).to.contain('restoapp_build_info{version="1.2.3"');
  });

  it("passes other paths through untouched", async () => {
    const middleware = endpoint.middleware(config, freshRegistry().getRegistry({
      defaultLabels: {}, collectDefaultMetrics: false, buildInfo: { version: "", commit: "", branch: "", node: "", staging: "0" },
    }));
    let nexted = false;
    await middleware(req({}, "/graphql", "POST"), makeRes(), () => { nexted = true; });
    expect(nexted).to.equal(true);
  });
});

// ---------- label hygiene ----------

describe("metrics hook > route classification", () => {
  const { classifyRoute } = require("../api/hooks/metrics/lib/httpMetrics");

  it("maps traffic onto a closed set of route classes", () => {
    expect(classifyRoute("/graphql")).to.equal("graphql");
    expect(classifyRoute("/healthz")).to.equal("health");
    expect(classifyRoute("/readyz")).to.equal("health");
    expect(classifyRoute("/mcp/group/menu")).to.equal("mcp");
    expect(classifyRoute("/red/flows")).to.equal("nodered");
    expect(classifyRoute("/admin/api/openharness/runs")).to.equal("admin-api");
    expect(classifyRoute("/admin/notifications-manager")).to.equal("admin");
    expect(classifyRoute("/restocore/assets/core-adminizer-assets/PromotionsManager.js")).to.equal("static");
    expect(classifyRoute("/bundle.css")).to.equal("static");
    expect(classifyRoute("/")).to.equal("spa");
  });

  it("never leaks record ids into the label", () => {
    // An order id in a URL must collapse into a class, not become a series.
    expect(classifyRoute("/admin/model/order/edit/6bb5587c-da6f-494f-b8b0-22e8a0c3a310")).to.equal("admin-api");
    expect(classifyRoute("/some/unknown/6bb5587c-da6f-494f-b8b0-22e8a0c3a310")).to.equal("other");
  });
});

// ---------- log-driven database diagnostics ----------

describe("metrics hook > db error classification", () => {
  const { classifyDbError } = require("../api/hooks/metrics/lib/collectors/runtime");

  it("recognises the failure modes seen in production", () => {
    // docs/crashloop-missing-column.md — a half-applied migration.
    expect(classifyDbError('AdapterError: column "spentCost" does not exist')).to.equal("missing_column");
    expect(classifyDbError('relation "notification" does not exist')).to.equal("missing_relation");
    // journal/2026-06-13-gfcafe-disk-full-postgres-down.md — postgres gone.
    expect(classifyDbError("getaddrinfo EAI_AGAIN postgres")).to.equal("connection");
    expect(classifyDbError("could not write lock file: No space left on device")).to.equal("disk_full");
  });

  it("ignores ordinary log lines", () => {
    expect(classifyDbError("Order > check: promotion applied")).to.equal(null);
  });
});

// ---------- order failures ----------

describe("metrics hook > order error attribution", () => {
  const { operationFromMessage, msUntilNextLocalMidnight } = require("../api/hooks/metrics/lib/collectors/emitter");

  it("labels an order error with the operation that failed", () => {
    // Core writes order logs as "<operation>: <what happened>".
    expect(operationFromMessage("check: failed")).to.equal("check");
    expect(operationFromMessage("countCart: promotion failed")).to.equal("countCart");
    expect(operationFromMessage("addDish: countCart failed")).to.equal("addDish");
    expect(operationFromMessage("order: RMS error")).to.equal("order");
    expect(operationFromMessage("payment: register failed")).to.equal("payment");
  });

  it("gives the money-in/order-not-placed line its own label", () => {
    expect(operationFromMessage("!!! CRITICAL: MONEY-IN, ORDER-NOT-PLACED CONDITION !!!"))
      .to.equal("money_in_no_order");
  });

  it("never turns a free-form message into a label", () => {
    expect(operationFromMessage("order 6bb5587c-da6f-494f-b8b0-22e8a0c3a310 failed")).to.equal("other");
    expect(operationFromMessage("")).to.equal("other");
    expect(operationFromMessage(undefined)).to.equal("other");
  });

  it("resets daily gauges at local server midnight", () => {
    const noon = new Date(2026, 6, 22, 12, 0, 0, 0);
    expect(msUntilNextLocalMidnight(noon)).to.equal(12 * 60 * 60 * 1000);
  });
});

// ---------- server error attribution ----------

describe("metrics hook > error source classification", () => {
  const { classifyErrorSource } = require("../api/hooks/metrics/lib/collectors/runtime");

  it("attributes logged errors to a subsystem", () => {
    expect(classifyErrorSource("GraphQL Error: Cannot query field")).to.equal("graphql");
    expect(classifyErrorSource("iiko sync failed: TOO_MANY_DATA_REQUESTED")).to.equal("rms");
    expect(classifyErrorSource("FCM send failed for device")).to.equal("notification");
    expect(classifyErrorSource("Order > doPaid error: ")).to.equal("order");
    expect(classifyErrorSource("AdapterError: column does not exist")).to.equal("database");
  });

  it("falls back to a single bucket instead of inventing labels", () => {
    expect(classifyErrorSource("something entirely unexpected")).to.equal("other");
  });
});

// ---------- unique device tracking ----------

describe("metrics hook > device activity", () => {
  const { DeviceActivity } = require("../api/hooks/metrics/lib/deviceActivity");

  const DEVICE_A = "4f9a1c2e-1111-4a2b-9c3d-000000000001";
  const DEVICE_B = "4f9a1c2e-1111-4a2b-9c3d-000000000002";

  it("counts a device once however many requests it makes", () => {
    const tracker = new DeviceActivity();
    tracker.track(DEVICE_A);
    tracker.track(DEVICE_A);
    tracker.track(DEVICE_B);
    const snapshot = tracker.snapshot();
    expect(snapshot.find((w: any) => w.label === "5m").count).to.equal(2);
    expect(snapshot.find((w: any) => w.label === "1h").count).to.equal(2);
  });

  it("ignores header values that are not device ids", () => {
    const tracker = new DeviceActivity();
    expect(tracker.track("drop table;")).to.equal(false);
    expect(tracker.track("")).to.equal(false);
    expect(tracker.track(undefined)).to.equal(false);
    expect(tracker.track("x".repeat(200))).to.equal(false);
    expect(tracker.snapshot()[0].count).to.equal(0);
  });

  it("drops devices that fell out of the window", () => {
    const tracker = new DeviceActivity();
    tracker.track(DEVICE_A);
    // Age the entry past the 5m window but keep it inside 1h.
    tracker.seen.set(DEVICE_A, Date.now() - 10 * 60 * 1000);
    tracker.track(DEVICE_B);
    const snapshot = tracker.snapshot();
    expect(snapshot.find((w: any) => w.label === "5m").count).to.equal(1);
    expect(snapshot.find((w: any) => w.label === "1h").count).to.equal(2);

    // Past the widest window the entry is pruned, not just uncounted.
    tracker.seen.set(DEVICE_A, Date.now() - 2 * 60 * 60 * 1000);
    tracker.snapshot();
    expect(tracker.seen.has(DEVICE_A)).to.equal(false);
  });
});

// ---------- registry ----------

describe("metrics hook > registry", () => {
  it("is a process-wide singleton", () => {
    const { getRegistry } = freshRegistry();
    const config = {
      defaultLabels: { stack: "test" },
      collectDefaultMetrics: false,
      buildInfo: { version: "", commit: "", branch: "", node: "", staging: "0" },
    };
    expect(getRegistry(config)).to.equal(getRegistry(config));
  });

  it("prefixes every application metric", async () => {
    const { getRegistry } = freshRegistry();
    const metrics = getRegistry({
      defaultLabels: {},
      collectDefaultMetrics: false,
      buildInfo: { version: "", commit: "", branch: "", node: "", staging: "0" },
    });
    metrics.ordersPlaced.inc({ self_service: "false" });
    const exposition: string = await metrics.registry.metrics();
    const names = exposition
      .split("\n")
      .filter((line) => line.startsWith("# HELP "))
      .map((line) => line.split(" ")[2]);
    expect(names.length).to.be.greaterThan(0);
    for (const name of names) expect(name).to.match(/^restoapp_/);
  });

  it("exports notification success/failure attempts by channel and trigger", async () => {
    const { getRegistry } = freshRegistry();
    const metrics = getRegistry({
      defaultLabels: {},
      collectDefaultMetrics: false,
      buildInfo: { version: "", commit: "", branch: "", node: "", staging: "0" },
    });
    metrics.notificationsCreatedByEvent.inc({ type: "order-paid", event: "order:paid" });
    metrics.notificationDeliveryAttempts.inc({ type: "order-paid", event: "order:paid", channel: "fcm-web", result: "success" });
    metrics.notificationDeliveryAttempts.inc({ type: "order-paid", event: "order:paid", channel: "sms", result: "failed" });

    const exposition: string = await metrics.registry.metrics();
    expect(exposition).to.contain('restoapp_notifications_created_by_event_total{type="order-paid",event="order:paid"} 1');
    expect(exposition).to.contain('restoapp_notification_delivery_attempts_total{type="order-paid",event="order:paid",channel="fcm-web",result="success"} 1');
    expect(exposition).to.contain('restoapp_notification_delivery_attempts_total{type="order-paid",event="order:paid",channel="sms",result="failed"} 1');
  });

  it("keeps resettable daily gauges separate from lifetime counters", async () => {
    const { getRegistry } = freshRegistry();
    const { resetDailyGauges } = require("../api/hooks/metrics/lib/collectors/emitter");
    const metrics = getRegistry({
      defaultLabels: {},
      collectDefaultMetrics: false,
      buildInfo: { version: "", commit: "", branch: "", node: "", staging: "0" },
    });
    const labels = { type: "order-paid", event: "order:paid", channel: "sms", result: "failed" };
    metrics.notificationDeliveryAttempts.inc(labels);
    metrics.notificationDeliveryAttemptsToday.inc(labels);

    resetDailyGauges(metrics);
    const exposition: string = await metrics.registry.metrics();
    expect(exposition).to.contain('restoapp_notification_delivery_attempts_total{type="order-paid",event="order:paid",channel="sms",result="failed"} 1');
    expect(exposition).not.to.contain('restoapp_notification_delivery_attempts_today{type="order-paid",event="order:paid",channel="sms",result="failed"}');
  });
});
