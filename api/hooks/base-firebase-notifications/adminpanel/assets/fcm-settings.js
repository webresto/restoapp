const React = window.React;
const h = React.createElement;
const { useEffect, useMemo, useRef, useState } = React;
const {
  Button,
  Checkbox,
  Input,
  Label,
  Textarea,
  Badge,
  Skeleton,
} = window.UIComponents;
const {
  AlertTriangle,
  CheckCircle2,
  Copy,
  FileJson,
  RefreshCw,
  Save,
  Upload,
} = window.LucideReact;

function getAdminPrefix() {
  const parts = window.location.pathname.split("/");
  return "/" + (parts[1] || "admin");
}

function getBaseAdminPath() {
  if (typeof window.routePrefix === "string" && window.routePrefix.trim()) {
    return window.routePrefix.replace(/\/$/, "");
  }
  return getAdminPrefix();
}

function detectView() {
  const pathname = (window.location.pathname || "").replace(/\/+$/, "");
  if (pathname.endsWith("/firebase-notifications/web")) return "web";
  return "mobile";
}

async function apiRequest(path, options = {}) {
  const response = await window.axios({
    url: `${getBaseAdminPath()}${path}`,
    method: options.method || "GET",
    data: options.body,
    headers: { Accept: "application/json", "Content-Type": "application/json" },
    withCredentials: true,
  });
  return response.data;
}

function emptyWebConfig() {
  return {
    apiKey: "",
    authDomain: "",
    projectId: "",
    storageBucket: "",
    messagingSenderId: "",
    appId: "",
    measurementId: "",
    vapidKey: "",
  };
}

function normalizeWebConfig(value) {
  return { ...emptyWebConfig(), ...(value || {}) };
}

function compactWebConfig(value) {
  const result = {};
  for (const [key, item] of Object.entries(value || {})) {
    if (item !== undefined && item !== null && String(item).trim() !== "") {
      result[key] = String(item).trim();
    }
  }
  return result;
}

function isWebConfigEmpty(value) {
  return Object.keys(compactWebConfig(value)).length === 0;
}

function createTranslator(messages) {
  const dictionary = messages || {};
  return function translate(key, params = {}) {
    const template = dictionary[key] || key;
    return Object.entries(params).reduce(
      (text, [paramKey, paramValue]) => text.replace(new RegExp(`{${paramKey}}`, "g"), paramValue),
      template
    );
  };
}

function errorMessage(error, fallback) {
  return error?.response?.data?.error || error?.message || fallback;
}

function errorDetails(error) {
  const data = error?.response?.data;
  const detail = data && (data.details || data.detail);
  const status = error?.response?.status;
  const parts = [];

  if (status) parts.push(`HTTP ${status}`);
  if (detail) {
    parts.push(typeof detail === "string" ? detail : JSON.stringify(detail, null, 2));
  } else if (data && typeof data === "object" && Object.keys(data).length > 0) {
    parts.push(JSON.stringify(data, null, 2));
  }

  return parts.join("\n\n");
}

function makeError(title, message, details) {
  return {
    title,
    message: message || "",
    details: details || "",
    at: new Date().toISOString(),
  };
}

function copyText(value, t) {
  if (!value) return;
  if (navigator.clipboard?.writeText) {
    navigator.clipboard.writeText(value)
      .then(() => window.sonner?.toast(t("Error copied")))
      .catch(() => window.sonner?.toast.error(t("Cannot copy error")));
    return;
  }

  const textarea = document.createElement("textarea");
  textarea.value = value;
  textarea.setAttribute("readonly", "readonly");
  textarea.style.position = "fixed";
  textarea.style.left = "-9999px";
  document.body.appendChild(textarea);
  textarea.select();
  try {
    document.execCommand("copy");
    window.sonner?.toast(t("Error copied"));
  } catch (_error) {
    window.sonner?.toast.error(t("Cannot copy error"));
  } finally {
    document.body.removeChild(textarea);
  }
}

function Section(props) {
  return h("section", { className: "rounded-xl border bg-card p-4 md:p-6" },
    h("div", { className: "mb-4 space-y-1" },
      h("h2", { className: "text-base font-semibold text-foreground" }, props.title),
      props.description
        ? h("p", { className: "max-w-[72ch] text-sm text-muted-foreground" }, props.description)
        : null
    ),
    props.children
  );
}

function Subsection(props) {
  return h("div", { className: "rounded-lg border bg-muted/30 p-4" },
    props.title
      ? h("div", { className: "mb-3 space-y-1" },
          h("h3", { className: "text-sm font-semibold text-foreground" }, props.title),
          props.description
            ? h("p", { className: "text-xs text-muted-foreground" }, props.description)
            : null
        )
      : null,
    props.children
  );
}

function Field(props) {
  return h("div", { className: "grid min-w-0 gap-1" },
    h(Label, { htmlFor: props.id, className: "text-sm font-semibold text-foreground" }, props.label),
    props.children,
    props.hint
      ? h("p", { className: "max-w-[60ch] text-xs text-muted-foreground" }, props.hint)
      : null
  );
}

function ChannelStatusBadge({ configured, initialized, t }) {
  if (configured && initialized) {
    return h(Badge, { className: "gap-1" }, h(CheckCircle2, { className: "h-3.5 w-3.5" }), t("Channel active"));
  }
  if (configured) {
    return h(Badge, { variant: "outline" }, t("Saved, startup check required"));
  }
  return h(Badge, { variant: "secondary" }, t("Not configured"));
}

function SummaryRow({ label, value, t }) {
  return h("div", { className: "grid gap-1 sm:grid-cols-[160px_1fr] sm:gap-3" },
    h("dt", { className: "text-xs text-muted-foreground" }, label),
    h("dd", { className: "break-all font-mono text-xs text-foreground" }, value || t("not set"))
  );
}

function ErrorPanel({ error, t }) {
  if (!error) return null;
  const normalized = typeof error === "string"
    ? makeError("Error", error)
    : error;
  const copyValue = [
    normalized.title,
    normalized.message,
    normalized.details,
    normalized.at ? `time: ${normalized.at}` : "",
  ].filter(Boolean).join("\n\n");

  return h("div", {
    className: "mb-6 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive md:mb-8",
    role: "alert",
  },
    h("div", { className: "flex flex-wrap items-start justify-between gap-3" },
      h("div", { className: "min-w-0 flex-1" },
        h("div", { className: "flex items-center gap-2 font-semibold" },
          h(AlertTriangle, { className: "h-4 w-4 shrink-0" }),
          h("span", null, normalized.title || t("Error"))
        ),
        h("p", { className: "mt-1 break-words" }, normalized.message || t("Unknown error")),
        normalized.details
          ? h("pre", { className: "mt-3 max-h-48 overflow-auto rounded-md border border-destructive/20 bg-background/70 p-3 font-mono text-xs text-foreground whitespace-pre-wrap" }, normalized.details)
          : null
      ),
      h(Button, { variant: "outline", size: "sm", type: "button", onClick: () => copyText(copyValue, t) },
        h(Copy, { className: "mr-1 h-4 w-4" }), t("Copy")
      )
    )
  );
}

function DropZone({ label, description, badge, disabled, onPick, onBrowse, t }) {
  const [dragActive, setDragActive] = useState(false);

  function handleDrag(event) {
    event.preventDefault();
    event.stopPropagation();
    if (disabled) return;
    setDragActive(event.type === "dragenter" || event.type === "dragover");
  }

  function handleDrop(event) {
    event.preventDefault();
    event.stopPropagation();
    setDragActive(false);
    if (disabled) return;
    const file = event.dataTransfer?.files?.[0];
    if (file) onPick(file);
  }

  return h("div", {
    className: [
      "rounded-lg border border-dashed p-4 transition-colors",
      dragActive ? "border-primary bg-primary/5" : "border-border bg-background",
      disabled ? "opacity-60" : "",
    ].filter(Boolean).join(" "),
    onDragEnter: handleDrag,
    onDragOver: handleDrag,
    onDragLeave: handleDrag,
    onDrop: handleDrop,
  },
    h("div", { className: "flex flex-wrap items-center gap-2" },
      h(Button, { variant: "outline", type: "button", disabled, onClick: onBrowse },
        h(Upload, { className: "mr-1 h-4 w-4" }), label
      ),
      badge
    ),
    h("p", { className: "mt-3 max-w-[60ch] text-xs text-muted-foreground" }, description),
    h("p", { className: "mt-2 text-xs font-medium text-muted-foreground" }, t("Drag a JSON file here."))
  );
}

function FcmSettings({ view, messages }) {
  const t = useMemo(() => createTranslator(messages), [messages]);
  const apiBase = "/core/firebase-notifications/settings";
  const isMobileView = view === "mobile";
  const isWebView = view === "web";

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [hasServiceAccountKey, setHasServiceAccountKey] = useState(false);
  const [serviceAccountSummary, setServiceAccountSummary] = useState(null);
  const [serviceAccountDraft, setServiceAccountDraft] = useState(null);
  const [serviceAccountFileName, setServiceAccountFileName] = useState("");
  const [mobileApnsUploaded, setMobileApnsUploaded] = useState(false);
  const [webConfig, setWebConfig] = useState(emptyWebConfig);
  const [initialized, setInitialized] = useState(false);
  const serviceAccountInputRef = useRef(null);
  const webConfigInputRef = useRef(null);

  const hasServiceAccount = hasServiceAccountKey || !!serviceAccountDraft;
  const webConfigComplete = ["apiKey", "projectId", "messagingSenderId", "appId", "vapidKey"]
    .every((k) => webConfig[k] && String(webConfig[k]).trim() !== "");
  const mobileConfigured = hasServiceAccount;
  const webConfigured = hasServiceAccount && webConfigComplete;
  const webConfigPreview = useMemo(() => JSON.stringify(compactWebConfig(webConfig), null, 2), [webConfig]);

  const channelConfigured = isMobileView ? mobileConfigured : webConfigured;
  const otherChannelLink = isMobileView
    ? `${getBaseAdminPath()}/firebase-notifications/web`
    : `${getBaseAdminPath()}/firebase-notifications/mobile`;
  const otherChannelLabel = isMobileView ? t("Browser push") : t("Mobile push");

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const data = await apiRequest(apiBase);
      setHasServiceAccountKey(data.hasServiceAccountKey === true);
      setServiceAccountSummary(data.serviceAccountSummary || null);
      setMobileApnsUploaded(data.mobileApnsUploaded === true);
      setWebConfig(normalizeWebConfig(data.webConfig));
      setInitialized(data.initialized === true);
      setServiceAccountDraft(null);
      setServiceAccountFileName("");
    } catch (err) {
      setError(makeError(
        t("Failed to load Firebase push settings"),
        errorMessage(err, t("Failed to load settings")),
        errorDetails(err)
      ));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  function updateWebConfigField(key, value) {
    setWebConfig((prev) => ({ ...prev, [key]: value }));
  }

  function validateServiceAccountDraft(value) {
    if (!value || typeof value !== "object" || Array.isArray(value)) {
      throw new Error(t("Service account JSON must be an object."));
    }
    const missing = ["project_id", "client_email", "private_key"].filter((key) => !value[key] || typeof value[key] !== "string");
    if (missing.length > 0) {
      throw new Error(t("Service account JSON must contain fields: {fields}.", { fields: missing.join(", ") }));
    }
  }

  function validateWebConfigDraft(value) {
    if (!value || typeof value !== "object" || Array.isArray(value)) {
      throw new Error(t("Web config JSON must be an object."));
    }
    const normalized = normalizeWebConfig(value);
    const missing = ["apiKey", "projectId", "messagingSenderId", "appId", "vapidKey"]
      .filter((key) => !normalized[key] || String(normalized[key]).trim() === "");
    if (missing.length > 0) {
      throw new Error(t("Web config JSON must contain fields: {fields}.", { fields: missing.join(", ") }));
    }
  }

  async function readJsonFile(file) {
    if (!file) return null;
    try {
      return JSON.parse(await file.text());
    } catch (error) {
      throw new Error(t("File must be valid JSON. {error}", { error: error.message || "" }).trim());
    }
  }

  async function pickServiceAccountFile(file) {
    if (!file) return;

    try {
      setError(null);
      const json = await readJsonFile(file);
      validateServiceAccountDraft(json);
      setServiceAccountDraft(json);
      setServiceAccountFileName(file.name);
      window.sonner?.toast(t("Service account JSON loaded into the form"));
    } catch (err) {
      const uploadError = makeError(
        t("Failed to load service account JSON"),
        err.message,
        `file: ${file.name}\nsize: ${file.size} bytes`
      );
      setError(uploadError);
      window.sonner?.toast.error(uploadError.message);
    }
  }

  async function handleServiceAccountFile(event) {
    const file = event.target.files && event.target.files[0];
    event.target.value = "";
    await pickServiceAccountFile(file);
  }

  async function pickWebConfigFile(file) {
    if (!file) return;

    try {
      setError(null);
      const json = await readJsonFile(file);
      validateWebConfigDraft(json);
      setWebConfig(normalizeWebConfig(json));
      window.sonner?.toast(t("Web config JSON loaded into the form"));
    } catch (err) {
      const uploadError = makeError(
        t("Failed to load web config JSON"),
        err.message,
        `file: ${file.name}\nsize: ${file.size} bytes`
      );
      setError(uploadError);
      window.sonner?.toast.error(uploadError.message);
    }
  }

  async function handleWebConfigFile(event) {
    const file = event.target.files && event.target.files[0];
    event.target.value = "";
    await pickWebConfigFile(file);
  }

  async function save() {
    setSaving(true);
    setError(null);
    try {
      const data = await apiRequest(apiBase, {
        method: "POST",
        body: {
          mobileEnabled: mobileConfigured,
          webEnabled: webConfigured,
          mobileApnsUploaded,
          serviceAccountKey: serviceAccountDraft,
          webConfig: isWebConfigEmpty(webConfig) ? null : compactWebConfig(webConfig),
        },
      });
      setHasServiceAccountKey(data.hasServiceAccountKey === true);
      setServiceAccountSummary(data.serviceAccountSummary || null);
      setMobileApnsUploaded(data.mobileApnsUploaded === true);
      setWebConfig(normalizeWebConfig(data.webConfig));
      setInitialized(data.initialized === true);
      setServiceAccountDraft(null);
      setServiceAccountFileName("");
      window.sonner?.toast(t("Settings saved"));
    } catch (err) {
      const message = errorMessage(err, t("Failed to save settings"));
      setError(makeError(
        t("Failed to save Firebase push settings"),
        message,
        errorDetails(err)
      ));
      window.sonner?.toast.error(message);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return h("div", { className: "mx-auto w-full max-w-7xl p-4 md:p-6" },
      h("div", { className: "grid gap-6 md:gap-8" },
        h(Skeleton, { className: "h-10 w-64" }),
        h(Skeleton, { className: "h-28 w-full" }),
        h(Skeleton, { className: "h-56 w-full" })
      )
    );
  }

  const title = isMobileView
    ? t("FCM Mobile push (iOS / Android)")
    : t("FCM Web push (browsers)");

  const intro = isMobileView
    ? t("The channel fcm-mobile sends push notifications to iOS and Android through Firebase Cloud Messaging. A server service account is required for setup.")
    : t("The channel fcm-web sends browser push notifications through Firebase Cloud Messaging. In addition to the service account, a public web config with a VAPID key is required.");

  return h("div", { className: "min-h-[calc(100vh-7rem)] bg-background text-foreground" },
    h("main", { className: "mx-auto w-full max-w-7xl p-4 md:p-6" },

      h("header", { className: "mb-6 md:mb-8" },
        h("div", { className: "flex flex-wrap items-start justify-between gap-4" },
          h("div", { className: "min-w-0 space-y-2" },
            h("div", { className: "flex flex-wrap items-center gap-3" },
              h("h1", { className: "text-xl font-semibold tracking-normal md:text-2xl" }, title),
              h(ChannelStatusBadge, { configured: channelConfigured, initialized, t })
            ),
            h("p", { className: "max-w-[72ch] text-sm text-muted-foreground" }, intro),
            h("p", { className: "text-xs text-muted-foreground" },
              t("Channel {channel} is configured on a separate page. The service account key is shared.", { channel: "__CHANNEL__" }).split("__CHANNEL__")[0],
              h("a", { href: otherChannelLink, className: "font-semibold text-primary underline-offset-2 hover:underline" }, otherChannelLabel),
              t("Channel {channel} is configured on a separate page. The service account key is shared.", { channel: "__CHANNEL__" }).split("__CHANNEL__")[1]
            )
          ),
          h("div", { className: "flex flex-wrap items-center gap-2" },
            h(Button, { variant: "outline", size: "sm", onClick: load, disabled: saving },
              h(RefreshCw, { className: "mr-1 h-4 w-4" }), t("Refresh")
            ),
            h(Button, {
              size: "sm",
              onClick: save,
              disabled: saving,
            },
              h(Save, { className: "mr-1 h-4 w-4" }), saving ? t("Saving...") : t("Save")
            )
          )
        )
      ),

      h(ErrorPanel, { error, t }),

      h("div", { className: "grid gap-6 md:gap-8" },

        h(Section, {
          title: t("Service account JSON"),
          description: t("Download the file in Firebase Console: Project Settings -> Service accounts -> Generate new private key. This is a secret server key; it is stored only in FCM_SERVICE_ACCOUNT_KEY and is used by both channels (mobile and web)."),
        },
          h("div", { className: "grid gap-4 lg:grid-cols-[minmax(0,1fr)_360px]" },
            h(Subsection, null,
              h("input", {
                ref: serviceAccountInputRef,
                type: "file",
                accept: ".json,application/json",
                className: "hidden",
                onChange: handleServiceAccountFile,
              }),
              h(DropZone, {
                label: t("Upload JSON file"),
                onBrowse: () => serviceAccountInputRef.current?.click(),
                onPick: pickServiceAccountFile,
                disabled: saving,
                t,
                badge: h(React.Fragment, null,
                  serviceAccountFileName ? h(Badge, { variant: "outline" }, serviceAccountFileName) : null,
                  serviceAccountDraft ? h(Badge, null, t("Uploaded file will update the key on save")) : null
                ),
                description: hasServiceAccountKey
                  ? t("Stored file will be replaced after clicking \"Save\".")
                  : t("The file is read in the browser and sent to the server only after clicking \"Save\"."),
              })
            ),
            h(Subsection, {
              title: hasServiceAccountKey ? t("Saved key") : t("Key not uploaded"),
              description: t("Visible fields are non-secret only."),
            },
              h("dl", { className: "grid gap-3" },
                h(SummaryRow, { label: "project_id", value: serviceAccountSummary?.projectId, t }),
                h(SummaryRow, { label: "client_email", value: serviceAccountSummary?.clientEmail, t }),
                h(SummaryRow, { label: "private_key_id", value: serviceAccountSummary?.privateKeyId, t })
              )
            )
          )
        ),

        isMobileView && h(Section, {
          title: t("APNs for iOS"),
          description: t("For FCM push delivery to iPhone and iPad, Firebase must have an APNs key or APNs certificate. This action is performed in Firebase/Apple Console and remains the project user's responsibility."),
        },
          h(Subsection, {
            title: t("What must be done outside WebResto"),
            description: t("Approximate path: Apple Developer -> Certificates, Identifiers & Profiles -> Keys -> create APNs Auth Key. Then Firebase Console -> Project settings -> Cloud Messaging -> Apple app configuration -> upload APNs key or certificate for the required iOS bundle id."),
          },
            h("label", { className: "flex cursor-pointer items-start gap-3 rounded-md border bg-background p-3" },
              h(Checkbox, {
                className: "mt-0.5 flex-shrink-0",
                checked: mobileApnsUploaded,
                onCheckedChange: (value) => setMobileApnsUploaded(value === true),
              }),
              h("span", { className: "grid gap-1 text-sm" },
                h("span", { className: "font-medium text-foreground" }, t("User confirmed APNs is uploaded to Firebase")),
                h("span", { className: "text-xs text-muted-foreground" },
                  t("The checkbox is optional and is not checked automatically. It only records manual confirmation: without correct APNs in Firebase, iOS push may not be delivered even if the service account is saved.")
                )
              )
            )
          )
        ),

        isWebView && h(Section, {
          title: t("Web config and VAPID"),
          description: t("These values come from Firebase web app config and Web Push certificates. They are public and required by the browser to receive a web push token."),
        },
          h("div", { className: "grid gap-4" },
            h(Subsection, null,
              h("input", {
                ref: webConfigInputRef,
                type: "file",
                accept: ".json,application/json",
                className: "hidden",
                onChange: handleWebConfigFile,
              }),
              h(DropZone, {
                label: t("Upload web config JSON"),
                onBrowse: () => webConfigInputRef.current?.click(),
                onPick: pickWebConfigFile,
                disabled: saving,
                t,
                description: t("You can paste the full object from Firebase Console as one file - fields will be filled automatically."),
              })
            ),

            h("div", { className: "grid gap-3 md:grid-cols-2 md:gap-4 xl:grid-cols-3" },
              h(Field, { id: "apiKey", label: "apiKey", hint: t("Firebase Console -> Project settings -> General -> Your apps.") },
                h(Input, { id: "apiKey", value: webConfig.apiKey, onChange: (e) => updateWebConfigField("apiKey", e.target.value) })
              ),
              h(Field, { id: "projectId", label: "projectId", hint: t("Firebase project identifier.") },
                h(Input, { id: "projectId", value: webConfig.projectId, onChange: (e) => updateWebConfigField("projectId", e.target.value) })
              ),
              h(Field, { id: "messagingSenderId", label: "messagingSenderId", hint: t("Sender ID from web app config.") },
                h(Input, { id: "messagingSenderId", value: webConfig.messagingSenderId, onChange: (e) => updateWebConfigField("messagingSenderId", e.target.value) })
              ),
              h(Field, { id: "appId", label: "appId", hint: t("Firebase App ID for the web app.") },
                h(Input, { id: "appId", value: webConfig.appId, onChange: (e) => updateWebConfigField("appId", e.target.value) })
              ),
              h(Field, { id: "vapidKey", label: "vapidKey", hint: t("Firebase Console -> Cloud Messaging -> Web Push certificates.") },
                h(Input, { id: "vapidKey", value: webConfig.vapidKey, onChange: (e) => updateWebConfigField("vapidKey", e.target.value) })
              ),
              h(Field, { id: "authDomain", label: "authDomain", hint: t("Optional, usually project.firebaseapp.com.") },
                h(Input, { id: "authDomain", value: webConfig.authDomain, onChange: (e) => updateWebConfigField("authDomain", e.target.value) })
              ),
              h(Field, { id: "storageBucket", label: "storageBucket", hint: t("Optional, if present in web app config.") },
                h(Input, { id: "storageBucket", value: webConfig.storageBucket, onChange: (e) => updateWebConfigField("storageBucket", e.target.value) })
              ),
              h(Field, { id: "measurementId", label: "measurementId", hint: t("Optional, used by Firebase Analytics.") },
                h(Input, { id: "measurementId", value: webConfig.measurementId, onChange: (e) => updateWebConfigField("measurementId", e.target.value) })
              )
            ),

            h(Subsection, {
              title: t("FCM_WEB_CONFIG preview"),
              description: t("The same object that will be saved on the server."),
            },
              h("div", { className: "flex items-center gap-2 text-xs text-muted-foreground" },
                h(FileJson, { className: "h-3.5 w-3.5" }),
                t("JSON")
              ),
              h(Textarea, {
                readOnly: true,
                value: webConfigPreview,
                rows: 8,
                className: "mt-2 font-mono text-xs",
              })
            )
          )
        )
      )
    )
  );
}

export default function FirebaseNotificationsSettings() {
  const props = arguments[0] || {};
  return h(FcmSettings, { view: detectView(), messages: props.messages });
}
