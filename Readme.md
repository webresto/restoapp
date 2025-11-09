
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
[![WhatsApp](https://img.shields.io/badge/Join-WhatsApp-%2325D366?logo=whatsapp&style=flat-square)](https://chat.whatsapp.com/CIc1MXXjbquAqeYHCt3k40)


## Features

- [x] **Modular architecture**: Ability to install various modules via the app store to extend the platform's functionality.
- [x] **Mobile Applications**: Supports mobile applications for iOS and Android platforms, providing users with a convenient way to order food on the go.
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
docker run --name restoapp -p 8080:8080 webresto/restoapp:latest
```

After the container starts, open your browser and navigate to [http://localhost:8080](http://localhost:8080) to access the RestoApp application.

### Build from Source

To build the Docker image from source:

```bash
docker build -t webresto/restoapp:latest .
```


## Setup
We currently only support installation via docker. Look at this image [webresto/restoapp](https://hub.docker.com/repository/docker/webresto/restoapp/general)

## Usage

### Image Structure

The image is managed by a supervisor program, serving for restarts. In earlier versions, the supervisor will likely be built into the container itself (or even within the Sails application).

### Seeds

The container supports loading initial data from the `seeds` folder, where `*.json` files with data arrays are located. When started with `process.env.DB_MIGRATE = "drop"` or `process.env.FORCE_SEED = "TRUE"` enabled, the data import process will be automatically launched.

All content from the `seeds/assets` folder is copied to `.tmp/public` with replacement. You can also specify the loading order of JS files in the `seeds/queue` file, with each file on a new line (extensions should not be specified).

Example:

```
group
# comment
dish
```

### Environment Variables

Environment variables are loaded into the container from the `.env` file (case-sensitive).


### ENV_LIST

*(Description not available)*

```

### RestoApp Modules

To install additional RestoApp modules into the container at startup, add the `/app/webresto-modules.list` file containing the module list, with each module on a new line. Each line will be executed using the `webresto install $line_module` template.

You can find more modules or even upload your own modules from [https://marketplace.restoapp.org/](https://marketplace.restoapp.org/).

Example:

```
payment
webhook
# comment
```

## Environment Variables

- `WR_DISABLE_MODULE_EXIST_CHECK`: Turn off module folder presence check (enables forced reinstallation based on the file)





## Thanks & Support

<a href="https://browserstack.com/"><img src="https://i.imgur.com/Rib9y9E.png" width="250px" /></a>


## License

[MIT License](https://opensource.org/licenses/MIT)  Copyright © 2018-2025

