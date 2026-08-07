
# RestoApp Platform Repository 

This repository is the main hub of the RestoApp ecosystem, powering both websites and mobile apps built on the platform.
It serves as the core framework that unifies all modules, handling their setup, dependencies, and configuration.

It includes:
- The module and package manager for integrating published modules
- The GraphQL API as the main interface for client–server communication
- The Admin Panel for managing content and system settings
- The RestoCore engine, the e-commerce core for restaurants and local businesses

## Join Our Community

Join our community to get support for everyone interested in food delivery using our restaurant engine. This is the place where restaurateurs and developers collaborate on the restaurant system. Get the latest news and share ideas. Join us!

[![Discord](https://img.shields.io/badge/Join-Discord-%237289DA?logo=discord&style=flat-square)](https://discord.gg/mbT4AeBJZ6)
[![Telegram](https://img.shields.io/badge/Join-Telegram-%232CA5E0?logo=telegram&style=flat-square)](https://t.me/restoapp_community)


## Features

- [x] **Modular architecture**: Ability to install various modules via the app store to extend the platform's functionality.
- [x] **Mobile Applications**: Supports mobile applications for iOS and Android platforms, providing users with a convenient way to order food on the go.
- [x] **Sales Channels**: Accept orders through bots, websites, mobile applications, social media, and assistant skills connected to the platform.
- [x] **Push Notifications**: Send real-time push notifications to customers, couriers, and staff about order status, promotions, and operational updates.
- [x] **Installer**: After deploying the system, an installer appears, allowing you to configure various parameters and launch the food delivery site in a short time.
- [x] **Simple installation with Docker**: The system is provided as a Docker container, ensuring easy deployment and installation without the need for deep programming knowledge.
- [x] **White Label solution**: Ability to use the project as a White Label solution for your own food delivery service.
- [x] **Modules and extensions**: Develop custom modules or purchase additional features and enhancements through the app store.
- [x] **Pro version with additional features**: A paid version is available with extended functionality, including delivery federation for managing multiple deliveries in one or multiple cities.
- [x] **Different Marketing for Different Regions**: Customize menu items, prices, promotions, and programs for different regions, cities, and districts.
- [x] **Integration with ERP, RMS Systems**: Automate your restaurant with any delivery system. Only up-to-date menu items will be displayed on your website, with stop lists automatically updated.
- [x] **Online Payment**: Integrate online payment service with API integration from your bank.
- [x] **Kitchen Video Streaming**: Set up online streaming from the kitchen displaying working hours after order placement.
- [x] **Delivery Customization on Map**: Divide the delivery map into zones considering price, delivery time, distance, weather conditions, and road congestion.
- [x] **Marketing Customization**: Create a custom system of bonuses, discounts, surcharges, promo codes, roulette, and gift certificates. Synchronize social media pages with the user dashboard.
- [x] **Admin Panel**: Access an administrative panel to manage and configure the platform's settings, and oversee business operations.
- [x] **Visual Programming**: Utilize a visual programming environment to intercept events on both the frontend and backend, allowing for modifications and the implementation of custom features without extensive programming knowledge.
- [x] **User Dashboard**: Manage all delivery-related information on the website, including menu items, order history, and delivery addresses.
- [x] **MCP Tools for AI Agents and Server Integrations**: Built-in [Model Context Protocol](docs/mcp.md) layer for both the HTTP MCP server and the internal AI agent. Exposes menu, dishes, image upload, health check, and admin tools that external agents and bots can call over plain HTTP, while server-side agents can invoke the same tools internally without a separate SDK. Extensible via `api/mcp/tools/` or module bootstrap. Disabled by default; enable HTTP access with `MCP_ENABLED=true` or internal agent access with `MCP_INTERNAL_ENABLED=true`.

## Mobile Application

The mobile application is designed to be wrapped as a web application. This ensures that the code is the same for both the web version and the mobile application, simplifying maintenance and development. All features created for the website can also be used in the mobile application, which can be tailored to your style.


## Contact for purchasing PRO

For support inquiries or purchasing the PRO version, please contact us on Telegram:

[Telegram @webresto_support](https://t.me/webresto_support)

## Installation

For detailed installation instructions, see [docs/install.md](docs/install.md).

The system installation is done via a Docker container and takes only 15 minutes. After installation, an installer appears, allowing you to configure parameters and launch the food delivery site.


## Docker
This Docker image represents a configured RestoApp backend project for Docker container usage. The main idea is that all modules are located in the `modules` folder and are loaded as hooks during application startup. It's also necessary to explicitly specify the production configuration. All of this is passed into the Docker container through respective folders and functions as expected.

Since the Sails framework is used as a base, it's necessary to explicitly or indirectly indicate where the hooks will be taken from.

### Quick Start

To run the application using Docker:

```bash
docker run --name restoapp -p 8080:8080 ghcr.io/webresto/restoapp:latest
```

After the container starts, open your browser and navigate to [http://localhost:8080](http://localhost:8080) to access the RestoApp application.

### Build from Source

To build the Docker image from source:

```bash
docker build -t ghcr.io/webresto/restoapp:latest .
```


## Setup
We currently only support installation via docker. Look at this image [ghcr.io/webresto/restoapp](https://github.com/webresto/restoapp/pkgs/container/restoapp)

### Running from Source

If you run the app directly (e.g. `npx tsx restoapp.js`) instead of via Docker, you must build the admin panel's Vite bundle for `local_modules/core` yourself — the Dockerfile does this during image build (`npm run build:adminizer`), but a plain source checkout does not build it automatically:

```bash
cd local_modules/core && npm run build:adminizer
```

Without this step, admin panel pages that load widgets from `local_modules/core` (e.g. `/admin/setup-checklist`) will fail silently in the browser console with `Failed to load module script: ... MIME type of "text/html"`, because the missing static asset falls through to the frontend's catch-all route instead of returning a 404.

## Usage


### Environment Variables

Environment variables are loaded into the container from the `.env` file (case-sensitive).

### Admin panel CAPTCHA (`ENABLE_ADMIN_CAPTCHA`)

The admin login form is protected by a proof-of-work CAPTCHA that the browser has to solve before the form is submitted. It is enabled by default; set `ENABLE_ADMIN_CAPTCHA=false` to turn it off (see `config/adminpanel.js`, key `adminpanel.auth.captcha`). Only the exact value `false` (case-insensitive) disables it — any other value leaves it on, so a typo cannot silently drop the protection. The value is read at boot, so restart the app after changing it. No frontend rebuild is needed: with the CAPTCHA off the server sends an empty task and the login page submits immediately.

**Known problem — login is impossible over plain `http://` on a non-local host.** The CAPTCHA is solved with `crypto.subtle`, which browsers expose only in a *secure context*: `https://`, or `http://localhost` / `http://127.0.0.1`. When the panel is opened over `http://` on a LAN IP or a domain without TLS, `crypto.subtle` is `undefined`, solving fails, and the login button just shows:

```
Error solving CAPTCHA. Try again.
```

No amount of retrying helps, and the server logs show no failed login attempt at all, because the request is never sent. If you hit this, pick one:

1. serve the panel over https (the normal fix for production);
2. open it as `http://localhost:<port>` — e.g. through an SSH tunnel: `ssh -L 8080:localhost:8080 user@server`;
3. set `ENABLE_ADMIN_CAPTCHA=false` — acceptable for local development, but it removes brute-force protection from the login form, so do not leave it off on a publicly reachable installation.

### ENV_LIST

*(Description not available)*

### RestoApp Modules

To install additional RestoApp modules into the container at startup, add the `/app/webresto-modules.list` file containing the module list, with each module on a new line. Each line will be executed using the `webresto install $line_module` template.

Marketplace channel selection for install and auto-update (`MODULES_AUTO_UPDATE`):
- `WR_MODULES_CHANNEL=main|staging|any` — explicit channel, always wins;
- otherwise `STAGING=1` selects `any` (the newest semver version across all marketplace channels — handy for dev stacks);
- otherwise `main` (stable).

You can find more modules or even upload your own modules from [https://marketplace.restoapp.org/](https://marketplace.restoapp.org/).


## Environment Variables
-

## Thanks & Support

<a href="https://browserstack.com/"><img src="https://i.imgur.com/Rib9y9E.png" width="250px" /></a>


## License

[MIT License](https://opensource.org/licenses/MIT)  Copyright © 2018-2026
Designed by humans
