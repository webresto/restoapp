"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FCMMobileChannel = void 0;

const { Channel } = require("@webresto/core/libs/NotificationManager");
const { getFirebaseAdmin, isFirebaseAdminInitialized } = require("../firebaseAdmin");

class FCMMobileChannel extends Channel {
  constructor() {
    super(...arguments);
    this.type = "fcm-mobile";
    this.forceSend = false;
    this.forGroupTo = ["user"];
    this.sortOrder = 10;
    this.cost = 0;
  }

  async isReady() {
    return isFirebaseAdminInitialized();
  }

  async isConfigured() {
    try {
      const key = await Settings.get("FCM_SERVICE_ACCOUNT_KEY");
      return Boolean(key && typeof key === "object" && key.project_id && key.client_email && key.private_key);
    } catch (_e) {
      return false;
    }
  }

  getConfigUrl() {
    return "/firebase-notifications/mobile";
  }

  async send(badge, message, user, subject, data, priorityDevice) {
    let devices;
    if (user?.id) {
      // Обычная адресация: все устройства пользователя с токеном
      devices = await UserDevice.find({
        user: user.id,
        notificationToken: { "!=": null },
      });
    } else if (priorityDevice?.id || priorityDevice?.notificationToken) {
      // Гостевая корзина без user: шлём только на устройство, с которого она обрабатывалась
      const dev = priorityDevice.notificationToken
        ? priorityDevice
        : await UserDevice.findOne({ id: priorityDevice.id, notificationToken: { "!=": null } });
      devices = dev ? [dev] : [];
    } else {
      throw new Error("[FCMMobileChannel] No user or device provided");
    }

    const mobileDevices = devices.filter((d) => {
      let token = d.notificationToken;
      if (typeof token === "string") {
        try { token = JSON.parse(token); } catch (_) { return false; }
      }
      d.notificationToken = token;
      return token && (token.platform === "ios" || token.platform === "android") && token.token;
    });

    if (mobileDevices.length === 0) {
      throw new Error(`[FCMMobileChannel] No mobile devices with notification tokens. devices: ${devices.length}, tokens: ${JSON.stringify(devices.map(d => ({ id: d.id, tokenType: typeof d.notificationToken, token: d.notificationToken })))}`);
    }

    let orderedDevices = mobileDevices;
    if (priorityDevice?.id) {
      const priorityIdx = mobileDevices.findIndex((d) => d.id === priorityDevice.id);
      if (priorityIdx > 0) {
        orderedDevices = [
          mobileDevices[priorityIdx],
          ...mobileDevices.filter((_, i) => i !== priorityIdx),
        ];
      }
    }

    const tokens = orderedDevices.map((d) => d.notificationToken.token);

    const admin = getFirebaseAdmin();
    const response = await admin.messaging().sendEachForMulticast({
      tokens,
      notification: {
        title: subject || "",
        body: message,
      },
      data: data ? { payload: JSON.stringify(data) } : undefined,
    });

    const invalidCodes = new Set([
      "messaging/invalid-registration-token",
      "messaging/registration-token-not-registered",
    ]);
    const invalidTokens = [];
    response.responses.forEach((r, idx) => {
      if (!r.success && r.error && invalidCodes.has(r.error.code)) {
        invalidTokens.push(tokens[idx]);
      }
    });

    if (invalidTokens.length > 0) {
      Promise.all(
        orderedDevices
          .filter((d) => invalidTokens.includes(d.notificationToken.token))
          .map((d) => UserDevice.updateOne({ id: d.id }).set({ notificationToken: null }))
      ).catch((e) => sails.log.error("[FCMMobileChannel] Failed to clear invalid tokens:", e));
    }

    if (response.successCount === 0) {
      throw new Error(`[FCMMobileChannel] All ${tokens.length} tokens failed`);
    }

    const firstSuccess = response.responses.find((r) => r.success);
    return firstSuccess?.messageId;
  }
}
exports.FCMMobileChannel = FCMMobileChannel;
