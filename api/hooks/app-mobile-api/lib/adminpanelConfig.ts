const hidden = false;

function date(value: unknown): string {
  return value ? new Date(Number(value)).toLocaleString() : "";
}

/**
 * MobileDevice in the admin panel: an ordinary model. A user sees their own devices
 * (`userAccessRelation`), the administrator all of them. "Revoked" or deleting the row signs the
 * phone out on its next request. Nothing else is editable, and devices are created only by login.
 */
export const deviceModelConfig = {
  model: "mobiledevice",
  title: "Mobile devices",
  icon: "smartphone",
  userAccessRelation: "user",
  add: false,
  list: {
    fields: {
      id: hidden,
      tokenHash: hidden,
      passwordFingerprint: hidden,
      user: true,
      name: true,
      platform: true,
      createdAt: { title: "Signed in", displayModifier: date },
      lastSeenAt: { title: "Last seen", displayModifier: date },
      expiresAt: hidden,
      revoked: true,
      updatedAt: hidden,
    },
  },
  edit: {
    fields: {
      id: { disabled: true },
      tokenHash: hidden,
      passwordFingerprint: hidden,
      user: { disabled: true },
      name: { disabled: true },
      platform: { disabled: true },
      lastSeenAt: { disabled: true },
      expiresAt: { disabled: true },
      revoked: { title: "Revoked" },
      createdAt: hidden,
      updatedAt: hidden,
    },
  },
};
