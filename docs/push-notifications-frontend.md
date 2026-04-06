# Push Notifications — Frontend Integration Guide

This guide covers integrating Firebase Cloud Messaging (FCM) push notifications on the web frontend.

> Mobile (Cordova) integration is handled in the Cordova repository — see that repo for iOS/Android specifics.

---

## Prerequisites

- FCM enabled on the backend: `FCM_ENABLED = true`, `FCM_SERVICE_ACCOUNT_KEY` and `FCM_WEB_CONFIG` set in Settings.
- `firebase-messaging-sw.js` served from the root of your domain (already present in `assets/`).

---

## 1. Get FCM Web Config from backend

Before initializing Firebase on the frontend, fetch the public config via GraphQL:

```graphql
query GetFCMWebConfig {
  settings(key: "FCM_WEB_CONFIG") {
    value
  }
}
```

The value contains:
```json
{
  "apiKey": "...",
  "projectId": "...",
  "messagingSenderId": "...",
  "appId": "...",
  "vapidKey": "..."
}
```

---

## 2. Initialize Firebase on the frontend (Web)

```js
import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

// config from backend (step 1)
const app = initializeApp(fcmWebConfig);
const messaging = getMessaging(app);
```

---

## 3. Register Service Worker and request permission

```js
async function initPushNotifications(fcmWebConfig) {
  // 1. Register service worker
  const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');

  // 2. Send config to SW so it can initialize Firebase
  registration.active?.postMessage({ type: 'FCM_CONFIG', config: fcmWebConfig });

  // 3. Request notification permission
  const permission = await Notification.requestPermission();
  if (permission !== 'granted') {
    console.warn('Push notification permission denied');
    return;
  }

  // 4. Get FCM token
  const token = await getToken(messaging, {
    vapidKey: fcmWebConfig.vapidKey,
    serviceWorkerRegistration: registration,
  });

  if (token) {
    await registerTokenOnBackend(token, 'web', 'fcm');
  }
}
```

---

## 4. Register token on the backend

Call this mutation after login and whenever FCM rotates the token (use `onTokenRefresh`):

```graphql
mutation RegisterNotificationToken($token: String!, $platform: String!, $provider: String!) {
  registerNotificationToken(token: $token, platform: $platform, provider: $provider)
}
```

Variables:
```json
{
  "token": "<FCM token>",
  "platform": "web",
  "provider": "fcm"
}
```

**When to call:**
- After successful login
- When `onTokenRefresh` fires (FCM rotates tokens periodically)

---

## 5. Receive foreground notifications

FCM does NOT show notifications automatically when the app is in the foreground. Handle them manually:

```js
onMessage(messaging, (payload) => {
  console.log('Foreground notification:', payload);

  // Show a custom notification UI or use the Notification API
  const { title, body } = payload.notification;
  new Notification(title, { body });

  // Mark as read when the user interacts
  if (payload.data?.notificationId) {
    // store notificationId for markNotificationRead call
  }
});
```

**Background notifications** are handled automatically by `firebase-messaging-sw.js` via `onBackgroundMessage`.

---

## 6. Payload structure

The `payload.data` object from FCM contains:

| Field | Description |
|-------|-------------|
| `notificationId` | The notification UUID (used for `markNotificationRead`) |
| `type` | Notification type (e.g. `"order-status"`, `"promo"`) |
| `orderId` | Order ID if relevant |
| `payload` | Full JSON payload as a string — parse with `JSON.parse(payload.data.payload)` |

---

## 7. Mark notification as read

When the user opens/taps a notification, mark it as read:

```graphql
mutation MarkNotificationRead($id: ID!) {
  markNotificationRead(id: $id)
}
```

Variables:
```json
{
  "id": "<notificationId from payload.data.notificationId>"
}
```

**When to call:**
- When user clicks/taps the notification banner
- When user opens the notification detail screen

The `id` is the notification UUID. Only the recipient knows it — this serves as a read token.

---

## 8. Token refresh

FCM periodically rotates tokens. Subscribe to refresh events:

```js
import { onIdTokenChanged } from 'firebase/auth';
// or use messaging token refresh:

// React example:
useEffect(() => {
  const unsubscribe = messaging.onTokenRefresh(async () => {
    const newToken = await getToken(messaging, { vapidKey: fcmWebConfig.vapidKey });
    await registerTokenOnBackend(newToken, 'web', 'fcm');
  });
  return unsubscribe;
}, []);
```

---

## Mobile (Cordova)

For iOS/Android, the flow is identical but the token is obtained via the Cordova FCM plugin:

```js
// Cordova — see the Cordova repo for the full implementation
FCMPlugin.getToken((token) => {
  registerTokenOnBackend(token, 'android', 'fcm'); // or 'ios'
});

FCMPlugin.onTokenRefresh((token) => {
  registerTokenOnBackend(token, 'android', 'fcm');
});
```

The `registerNotificationToken` GraphQL mutation accepts the token regardless of platform — the backend stores it in `UserDevice.notificationToken` and routes to `FCMMobileChannel` (iOS/Android) or `FCMWebChannel` (web) automatically.
