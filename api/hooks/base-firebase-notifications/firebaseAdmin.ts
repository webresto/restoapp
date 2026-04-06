import * as admin from "firebase-admin";

let initialized = false;

export function initFirebaseAdmin(serviceAccountKey: object): void {
  if (initialized) return;
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccountKey as admin.ServiceAccount),
  });
  initialized = true;
}

export function isFirebaseAdminInitialized(): boolean {
  return initialized;
}

export function getFirebaseAdmin(): typeof admin {
  if (!initialized) {
    throw new Error("[FCM] firebase-admin not initialized");
  }
  return admin;
}
