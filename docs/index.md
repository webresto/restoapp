
# [Install](./install.md) | [Features](./features.md) | [Modules](./modules.md) | [Custom Module](./custom-module/index.md) | [MCP](./custom-module/mcp-tools.md)

# RestoApp: Open-Source Backend for Food Delivery and Local Commerce

RestoApp is an open-source backend for food delivery and local commerce applications and websites. It deploys easily via Docker and offers flexible customization. The system automatically updates stop lists, supports product modifiers, recommended items, and promotions that can be configured through a visual editor. It also allows switching between cities, making it ideal for multi-location businesses.

Perfect for franchises, as you have full control over the code. We are also preparing a cloud solution to help you launch quickly without complex server setup, ensuring seamless operation and technical support. You can independently create a website using the builder and then convert it into a mobile app via Cordova.

## Focus on Local Commerce
- Designed specifically for local marketing strategies.
- Recognizes the differences between local and online marketing.
- Prioritizes solutions tailored for local commerce.

---

## Core system Functionality

## Core System Functionality
### 1. Platform Overview
The website serves as a platform for listing products that can be managed from the admin panel. These products are adapted for selling:
- Restaurant dishes with modifiers.
- Service-based products.
- Standard goods.

This setup covers a wide range of products suitable for local trade. Theoretically, it can also facilitate sales beyond city limits via the internet or other channels.

### 2. Order Processing and Checkout
- When items are added to the cart, the system calculates the pre-check.
- Users proceed to checkout, where they select parameters and place an order.
- Order tracking is available:
  - On the order status page.
  - In the personal account under order history.

### 3. User Account and Notifications
- Users can log in to their personal account on the website.
- Notifications can be sent via SMS.
- SMS notifications require integration through SMS Channels or a module.
- In the personal account, users can:
  - View order history.
  - Check bonus spending history.
  - Manage personal and guest information, including age and phone number.
  - Receive personalized offers.

### 4. Adapters for Integrations
Enable connection to various systems for external and internal integrations:
- Integration with external payment systems.
- Connection of internal payment systems.
- Payment with bonuses from different wallets with balance display in the user account.
- Support for multiple bonus systems simultaneously.

### 5. Integration with RMS (Restaurant Management System)
Allows interaction with restaurant management systems:
- Exchange of dish quantities in the stop list.
- Menu and stock synchronization.
- Full integration with external RMS.
- Option to manage everything via the website without an adapter.

### 6. Integration with Delivery Calculation Systems
- Connection to external courier management systems.
- Calculation of delivery costs.
- Option to operate without an adapter.
- Support for custom delivery systems via classes.

### 7. Promotion Adapter
- Automatic cart recalculation when adding items.
- Application of special discounts and promotions.
- Ability to create custom promotions.
- Support for external requests to determine discount eligibility.
- Option to completely replace the promotion adapter.
- Implemented as an abstract class for customization.

### 8. Promo Codes
- Built-in promo code support without an adapter.
- Configuration of ranges and validity periods for promo codes.
- Support for one-time and recurring activations.
- A future adapter for integration with external promo code systems is planned.

### 9. API and Frontend
- Support for REST API and GraphQL.
- Ability to develop a custom application.
- Frontend is built with Angular and provided as a service.
- Free and paid versions of the frontend available.

