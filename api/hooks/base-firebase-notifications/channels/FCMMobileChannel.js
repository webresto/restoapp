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

  async send(badge, message, user, subject, data, priorityDevice) {
    if (!user?.id) {
      throw new Error("[FCMMobileChannel] No user provided");
    }

    const devices = await UserDevice.find({
      user: user.id,
      notificationToken: { "!=": null },
    });

    const mobileDevices = devices.filter((d) => {
      const token = d.notificationToken;
      return token && (token.platform === "ios" || token.platform === "android") && token.token;
    });

    if (mobileDevices.length === 0) {
      throw new Error("[FCMMobileChannel] No mobile devices with notification tokens");
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
