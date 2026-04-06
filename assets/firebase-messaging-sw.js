// Firebase Web Push Service Worker
// This file must be served from the root of the domain (e.g. https://example.com/firebase-messaging-sw.js)
// The public FCM_WEB_CONFIG is injected by the frontend before registering this SW,
// or fetched via the GraphQL query getFCMWebConfig.

importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js');

// Config is injected by the page before registering this service worker.
// The SW reads it from a broadcast channel or IndexedDB set by the main thread.
// Alternatively, you can hardcode the public config here (it is safe to expose).
// Example:
// firebase.initializeApp({
//   apiKey: "...",
//   projectId: "...",
//   messagingSenderId: "...",
//   appId: "...",
// });

self.addEventListener('message', function (event) {
  if (event.data && event.data.type === 'FCM_CONFIG') {
    firebase.initializeApp(event.data.config);
    const messaging = firebase.messaging();

    messaging.onBackgroundMessage(function (payload) {
      const notificationTitle = payload.notification?.title || 'Notification';
      const notificationOptions = {
        body: payload.notification?.body || '',
        icon: payload.notification?.icon || '/favicon.ico',
        data: payload.data || {},
      };

      self.registration.showNotification(notificationTitle, notificationOptions);
    });
  }
});

// Handle notification click — open the app
self.addEventListener('notificationclick', function (event) {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function (clientList) {
      for (const client of clientList) {
        if ('focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow('/');
      }
    })
  );
});
