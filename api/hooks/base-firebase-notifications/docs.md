# base-firebase-notifications

Хук подключает Firebase Cloud Messaging (FCM) к `NotificationManager` из `@webresto/core`.  
Регистрирует два канала: **fcm-mobile** (iOS/Android) и **fcm-web** (браузер).

---

## Минимальная настройка

### 1. Получить сервисный аккаунт Firebase

1. Открыть [Firebase Console](https://console.firebase.google.com) → Project Settings → Service accounts.
2. Нажать **Generate new private key** — скачается JSON-файл.

### 2. Записать настройки в БД

Хук читает конфиг через `Settings.get()`. Достаточно двух записей:

| Ключ | Тип | Описание |
|---|---|---|
| `FCM_ENABLED` | boolean | Включает хук. Если `false` — ничего не происходит. |
| `FCM_SERVICE_ACCOUNT_KEY` | json | Содержимое JSON-файла сервисного аккаунта (целиком). |

Пример через adminizer или прямой запрос к API настроек:

```json
// FCM_ENABLED
true

// FCM_SERVICE_ACCOUNT_KEY
{
  "type": "service_account",
  "project_id": "my-project",
  "private_key_id": "...",
  "private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-xxx@my-project.iam.gserviceaccount.com",
  ...
}
```

> **Важно:** `FCM_SERVICE_ACCOUNT_KEY` — секрет. Не передавать на фронтенд.

### 3. (Опционально) Веб-конфиг для фронтенда

Если нужны web push уведомления, добавить публичную конфигурацию Firebase:

| Ключ | Тип | Описание |
|---|---|---|
| `FCM_WEB_CONFIG` | json | Публичный конфиг Firebase для браузера (`apiKey`, `projectId`, `messagingSenderId`, `appId`, `vapidKey`). Можно передавать клиенту. |

---

## Полный гайд: создание проекта и получение ключей вручную

### Шаг 1 — Создать проект в Firebase Console

1. Открыть [console.firebase.google.com](https://console.firebase.google.com).
2. Нажать **Add project** (или выбрать существующий).
3. Ввести имя проекта (например, `my-restoapp`).
4. Google Analytics — по желанию, для FCM не нужен. Нажать **Continue** → **Create project**.
5. Дождаться создания → **Continue**.

---

### Шаг 2 — Подключить приложения к проекту

#### Android

1. На главной странице проекта нажать иконку **Android** (Add app).
2. **Android package name** — например `com.example.restoapp`. Должен совпадать с `applicationId` в `build.gradle`.
3. App nickname — любое (опционально).
4. Debug signing certificate SHA-1 — опционально (нужен для Google Sign-In, не для FCM).
5. **Register app** → скачать `google-services.json`.
6. Положить файл в корень модуля приложения: `app/google-services.json`.
7. В `build.gradle` (project-level) добавить:
   ```groovy
   classpath 'com.google.gms:google-services:4.4.1'
   ```
8. В `build.gradle` (app-level) добавить плагин и зависимость:
   ```groovy
   apply plugin: 'com.google.gms.google-services'

   dependencies {
     implementation 'com.google.firebase:firebase-messaging:23.4.1'
   }
   ```

#### iOS

1. На главной странице проекта нажать иконку **iOS+** (Add app).
2. **Apple bundle ID** — например `com.example.restoapp`. Должен совпадать с Bundle Identifier в Xcode.
3. App nickname и App Store ID — опционально.
4. **Register app** → скачать `GoogleService-Info.plist`.
5. В Xcode: перетащить `GoogleService-Info.plist` в корень проекта (убедиться что **Copy items if needed** отмечено, и файл добавлен во все нужные targets).
6. Установить Firebase SDK через CocoaPods:
   ```ruby
   # Podfile
   pod 'Firebase/Messaging'
   ```
   Запустить `pod install`.
7. В `AppDelegate.swift`:
   ```swift
   import Firebase
   import UserNotifications

   @UIApplicationMain
   class AppDelegate: UIResponder, UIApplicationDelegate, UNUserNotificationCenterDelegate, MessagingDelegate {

     func application(_ application: UIApplication,
                      didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
       FirebaseApp.configure()
       Messaging.messaging().delegate = self
       UNUserNotificationCenter.current().delegate = self

       UNUserNotificationCenter.current().requestAuthorization(options: [.alert, .badge, .sound]) { granted, _ in
         guard granted else { return }
         DispatchQueue.main.async { application.registerForRemoteNotifications() }
       }
       return true
     }

     // Получить FCM token
     func messaging(_ messaging: Messaging, didReceiveRegistrationToken fcmToken: String?) {
       guard let token = fcmToken else { return }
       // Отправить token на бэкенд → сохранить в UserDevice
       sendTokenToServer(token: token, platform: "ios")
     }
   }
   ```

---

### Шаг 3 — Подключить APNs для iOS (обязательно)

FCM на iOS работает поверх APNs (Apple Push Notification service). Без этого push-уведомления на iPhone не придут.

#### 3.1 Создать APNs Auth Key в Apple Developer Portal

Это **рекомендуемый способ** (один ключ для всех приложений, не истекает).

1. Открыть [developer.apple.com](https://developer.apple.com) → **Certificates, Identifiers & Profiles** → **Keys**.
2. Нажать **+** (Create a new key).
3. Название — любое, например `FCM Push Key`.
4. Включить чекбокс **Apple Push Notifications service (APNs)**.
5. **Continue** → **Register** → скачать `.p8` файл.
   > Файл скачивается **один раз**. Сохрани его надёжно.
6. Запомнить **Key ID** (10 символов, например `ABC1234567`).
7. Запомнить **Team ID** — в правом верхнем углу на странице аккаунта (10 символов).

#### 3.2 Загрузить APNs Key в Firebase

1. Firebase Console → Project Settings → вкладка **Cloud Messaging**.
2. В секции **Apple app configuration** найти своё iOS-приложение.
3. В поле **APNs Authentication Key** нажать **Upload**.
4. Загрузить `.p8` файл, ввести **Key ID** и **Team ID**.
5. Сохранить.

#### Альтернатива — APNs Certificate (устаревший способ)

Если по каким-то причинам нужен сертификат вместо ключа:

1. Xcode → Signing & Capabilities → нажать **+** → добавить **Push Notifications**.
2. developer.apple.com → Certificates → создать **Apple Push Notification service SSL (Sandbox & Production)**.
3. Выбрать App ID → скачать `.cer` → установить в Keychain → экспортировать как `.p12`.
4. Firebase Console → Cloud Messaging → Upload `.p12` + ввести пароль (если задавался).

> Срок действия сертификата — 1 год. APNs Auth Key не истекает — лучше использовать ключ.

---

### Шаг 4 — Получить Service Account Key (для бэкенда)

Это `FCM_SERVICE_ACCOUNT_KEY` — серверный секрет для отправки уведомлений через `firebase-admin`.

1. Firebase Console → **Project Settings** (шестерёнка) → вкладка **Service accounts**.
2. Убедиться что выбрано **Firebase Admin SDK** → **Node.js**.
3. Нажать **Generate new private key** → **Generate key**.
4. Скачается JSON-файл примерно такого вида:
   ```json
   {
     "type": "service_account",
     "project_id": "my-restoapp-12345",
     "private_key_id": "a1b2c3d4e5f6...",
     "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQ...\n-----END PRIVATE KEY-----\n",
     "client_email": "firebase-adminsdk-xxxxx@my-restoapp-12345.iam.gserviceaccount.com",
     "client_id": "123456789012345678901",
     "auth_uri": "https://accounts.google.com/o/oauth2/auth",
     "token_uri": "https://oauth2.googleapis.com/token",
     "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
     "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/..."
   }
   ```
5. **Не коммитить этот файл в git.** Содержимое целиком записать в настройку `FCM_SERVICE_ACCOUNT_KEY` (тип `json`).

---

### Шаг 5 — Получить Web Config (для браузерных push)

Это `FCM_WEB_CONFIG` — публичная конфигурация для фронтенда. Можно передавать клиенту.

1. Firebase Console → Project Settings → вкладка **General**.
2. Прокрутить вниз до **Your apps** → найти Web App (или добавить через иконку `</>`).
3. В блоке **SDK setup and configuration** выбрать **Config** → скопировать объект:
   ```js
   const firebaseConfig = {
     apiKey: "AIzaSy...",
     authDomain: "my-restoapp.firebaseapp.com",
     projectId: "my-restoapp-12345",
     storageBucket: "my-restoapp.appspot.com",
     messagingSenderId: "123456789012",
     appId: "1:123456789012:web:abcdef123456"
   };
   ```
4. **Получить VAPID Key** (нужен для web push):
   - Firebase Console → Project Settings → **Cloud Messaging** → прокрутить до **Web configuration**.
   - В поле **Web Push certificates** нажать **Generate key pair** (если ещё нет).
   - Скопировать **Key pair** — это и есть `vapidKey`.
5. Записать в `FCM_WEB_CONFIG`:
   ```json
   {
     "apiKey": "AIzaSy...",
     "authDomain": "my-restoapp.firebaseapp.com",
     "projectId": "my-restoapp-12345",
     "storageBucket": "my-restoapp.appspot.com",
     "messagingSenderId": "123456789012",
     "appId": "1:123456789012:web:abcdef123456",
     "vapidKey": "BNxxxxxxxxxxxxxxx..."
   }
   ```

---

### Шаг 6 — Включить FCM в настройках

После того как все ключи получены, записать в БД через adminizer:

| Ключ | Значение |
|---|---|
| `FCM_ENABLED` | `true` |
| `FCM_SERVICE_ACCOUNT_KEY` | JSON из шага 4 (целиком) |
| `FCM_WEB_CONFIG` | JSON из шага 5 (опционально) |

Перезапустить сервер — хук подхватит настройки и зарегистрирует каналы `fcm-mobile` и `fcm-web`.

---

### Проверка

После запуска в логах должно быть:
```
[FCM] Channels registered (mobile + web)
```

В разделе **Notification Channels** adminpanel появятся каналы `fcm-mobile` и `fcm-web` со статусом `ready: true`.

---

## Как работает

1. После загрузки ORM хук вызывает `tryInitFCM()`.
2. Читает `FCM_ENABLED` — если `false`, останавливается.
3. Читает `FCM_SERVICE_ACCOUNT_KEY` и инициализирует `firebase-admin`.
4. Регистрирует каналы в `NotificationManager`:
   - `fcm-mobile` — ищет устройства пользователя с `platform: "ios"` или `"android"`.
   - `fcm-web` — ищет устройства с `platform: "web"`.
5. Токены невалидных устройств автоматически очищаются после неудачной отправки.

### Требования к модели `UserDevice`

Поле `notificationToken` должно хранить объект:

```json
{
  "platform": "ios" | "android" | "web",
  "token": "<FCM registration token>"
}
```

---

## Структура файлов

```
base-firebase-notifications/
├── index.js                        # Sails hook, точка входа
├── initialize.js                   # tryInitFCM — читает Settings, регистрирует каналы
├── firebaseAdmin.js                # Инициализация и получение инстанса firebase-admin
├── channels/
│   ├── FCMMobileChannel.js         # Канал для iOS/Android (sortOrder: 10)
│   └── FCMWebChannel.js            # Канал для браузера  (sortOrder: 11)
└── settings/
    ├── fcm_enabled.json            # Схема настройки FCM_ENABLED
    ├── fcm_service_account_key.json # Схема настройки FCM_SERVICE_ACCOUNT_KEY
    └── fcm_web_config.json         # Схема настройки FCM_WEB_CONFIG
```
