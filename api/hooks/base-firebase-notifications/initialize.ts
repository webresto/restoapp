import { NotificationManager } from "@webresto/core/libs/NotificationManager";
import { initFirebaseAdmin } from "./firebaseAdmin";
import { FCMMobileChannel } from "./channels/FCMMobileChannel";
import { FCMWebChannel } from "./channels/FCMWebChannel";

export async function tryInitFCM(): Promise<void> {
  const enabled = await Settings.get("FCM_ENABLED");
  if (!enabled) return;

  const key = await Settings.get("FCM_SERVICE_ACCOUNT_KEY");
  if (!key) {
    sails.log.warn("[FCM] FCM_ENABLED=true but FCM_SERVICE_ACCOUNT_KEY not set");
    return;
  }

  try {
    initFirebaseAdmin(key as object);
    NotificationManager.registerChannel(new FCMMobileChannel());
    NotificationManager.registerChannel(new FCMWebChannel());
    sails.log.info("[FCM] Channels registered (mobile + web)");
  } catch (e) {
    sails.log.error("[FCM] Init failed:", e);
    // Не крашим — уведомления останутся pending, retry-loop доставит при следующем цикле
  }
}
