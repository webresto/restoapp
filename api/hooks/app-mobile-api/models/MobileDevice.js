/**
 * A phone signed in to the mobile API. The token itself is never stored: only its sha256.
 * In the admin panel every user sees their own devices (userAccessRelation), the administrator all;
 * ticking "revoked" or deleting the row signs the phone out on its next request.
 */
module.exports = {
  tableName: "mobile_device",
  primaryKey: "id",
  attributes: {
    id: { type: "string", required: true },
    tokenHash: { type: "string", required: true, unique: true },
    user: { model: "userap", required: true },
    name: { type: "string", allowNull: true },
    platform: { type: "string", allowNull: true },
    /** sha256 of the password hash when the token was issued: a new password signs every device out. */
    passwordFingerprint: { type: "string", required: true },
    lastSeenAt: { type: "number" },
    /** Absolute end of the token, 90 days after issue. */
    expiresAt: { type: "number" },
    revoked: { type: "boolean", defaultsTo: false },
  },
};
