import { Channel } from "@webresto/core/libs/NotificationManager";
import { UserRecord } from "@webresto/core/models/User";
import { UserDeviceRecord, NotificationToken } from "@webresto/core/models/UserDevice";
import { getFirebaseAdmin, isFirebaseAdminInitialized } from "../firebaseAdmin";

export class FCMMobileChannel extends Channel {
  type = "fcm-mobile";
  forceSend = false;
  forGroupTo = ["user"];
  sortOrder = 10;
  cost = 0; // FCM бесплатный

  public async isReady(): Promise<boolean> {
    return isFirebaseAdminInitialized();
  }

  protected async send(
    badge: "info" | "error",
    message: string,
    user: UserRecord,
    subject?: string,
    data?: object,
    priorityDevice?: UserDeviceRecord
  ): Promise<string | void> {
    if (!user?.id) {
      throw new Error("[FCMMobileChannel] No user provided");
    }

    // Получаем все устройства пользователя с токеном для mobile платформ
    const devices: UserDeviceRecord[] = await UserDevice.find({
      user: user.id,
      notificationToken: { "!=": null },
    });

    const mobileDevices = devices.filter((d) => {
      const token = d.notificationToken as NotificationToken | null;
      return token && (token.platform === "ios" || token.platform === "android") && token.token;
    });

    if (mobileDevices.length === 0) {
      throw new Error("[FCMMobileChannel] No mobile devices with notification tokens");
    }

    // Если передан priorityDevice — ставим его первым
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

    const tokens = orderedDevices.map((d) => (d.notificationToken as NotificationToken).token);

    const admin = getFirebaseAdmin();
    const response = await admin.messaging().sendEachForMulticast({
      tokens,
      notification: {
        title: subject || "",
        body: message,
      },
      data: data ? { payload: JSON.stringify(data) } : undefined,
    });

    // Удаляем невалидные токены
    const invalidCodes = new Set([
      "messaging/invalid-registration-token",
      "messaging/registration-token-not-registered",
    ]);
    const invalidTokens: string[] = [];
    response.responses.forEach((r, idx) => {
      if (!r.success && r.error && invalidCodes.has(r.error.code)) {
        invalidTokens.push(tokens[idx]);
      }
    });

    if (invalidTokens.length > 0) {
      // Обнуляем невалидные токены асинхронно, не блокируем доставку
      Promise.all(
        orderedDevices
          .filter((d) => invalidTokens.includes((d.notificationToken as NotificationToken).token))
          .map((d) => UserDevice.updateOne({ id: d.id }).set({ notificationToken: null }))
      ).catch((e) => sails.log.error("[FCMMobileChannel] Failed to clear invalid tokens:", e));
    }

    if (response.successCount === 0) {
      throw new Error(`[FCMMobileChannel] All ${tokens.length} tokens failed`);
    }

    // Возвращаем messageId первого успешного ответа
    const firstSuccess = response.responses.find((r) => r.success);
    return firstSuccess?.messageId;
  }
}
