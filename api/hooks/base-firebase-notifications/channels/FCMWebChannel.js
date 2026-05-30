"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FCMWebChannel = void 0;

const { Channel } = require("@webresto/core/libs/NotificationManager");
const { getFirebaseAdmin, isFirebaseAdminInitialized } = require("../firebaseAdmin");

class FCMWebChannel extends Channel {
  constructor() {
    super(...arguments);
    this.type = "fcm-web";
    this.forceSend = false;
    this.forGroupTo = ["user"];
    this.sortOrder = 11;
    this.cost = 0;
  }

  async isReady() {
    return isFirebaseAdminInitialized();
  }

  async isConfigured() {
    try {
      const key = await Settings.get("FCM_SERVICE_ACCOUNT_KEY");
      const hasServiceAccount = Boolean(
        key && typeof key === "object" && key.project_id && key.client_email && key.private_key
      );
      if (!hasServiceAccount) return false;
      const webConfig = await Settings.get("FCM_WEB_CONFIG");
      if (!webConfig || typeof webConfig !== "object") return false;
      const required = ["apiKey", "projectId", "messagingSenderId", "appId", "vapidKey"];
      return required.every((k) => webConfig[k] && String(webConfig[k]).trim() !== "");
    } catch (_e) {
      return false;
    }
  }

  getConfigUrl() {
    return "/firebase-notifications/web";
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
      throw new Error("[FCMWebChannel] No user or device provided");
    }

    const webDevices = devices.filter((d) => {
      const token = d.notificationToken;
      return token && token.platform === "web" && token.token;
    });

    if (webDevices.length === 0) {
      throw new Error("[FCMWebChannel] No web devices with notification tokens");
    }

    let orderedDevices = webDevices;
    if (priorityDevice?.id) {
      const priorityIdx = webDevices.findIndex((d) => d.id === priorityDevice.id);
      if (priorityIdx > 0) {
        orderedDevices = [
          webDevices[priorityIdx],
          ...webDevices.filter((_, i) => i !== priorityIdx),
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
      webpush: {
        notification: {
          title: subject || "",
          body: message,
        },
      },
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
      ).catch((e) => sails.log.error("[FCMWebChannel] Failed to clear invalid tokens:", e));
    }

    if (response.successCount === 0) {
      throw new Error(`[FCMWebChannel] All ${tokens.length} tokens failed`);
    }

    const firstSuccess = response.responses.find((r) => r.success);
    return firstSuccess?.messageId;
  }
}
exports.FCMWebChannel = FCMWebChannel;
