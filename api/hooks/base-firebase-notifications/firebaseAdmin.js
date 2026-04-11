"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initFirebaseAdmin = initFirebaseAdmin;
exports.isFirebaseAdminInitialized = isFirebaseAdminInitialized;
exports.getFirebaseAdmin = getFirebaseAdmin;

const admin = require("firebase-admin");

let initialized = false;

function initFirebaseAdmin(serviceAccountKey) {
  if (initialized) return;
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccountKey),
  });
  initialized = true;
}

function isFirebaseAdminInitialized() {
  return initialized;
}

function getFirebaseAdmin() {
  if (!initialized) {
    throw new Error("[FCM] firebase-admin not initialized");
  }
  return admin;
}
