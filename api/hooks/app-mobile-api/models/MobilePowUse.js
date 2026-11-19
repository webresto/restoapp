/**
 * Solved CAPTCHA tasks. The task proves itself by its signature; this table only makes it single-use:
 * the second insert of the same id fails on the primary key, in whichever worker it happens.
 */
module.exports = {
  tableName: "mobile_pow_use",
  primaryKey: "id",
  // Not in the storefront's GraphQL: the mobile API's own records (devices, sign-in attempts, drafts) are
  // nobody's public data — and a `userap` link has no type there, so the schema would not even build.
  graphql: { public: false },
  attributes: {
    id: { type: "string", required: true },
    label: { type: "string", allowNull: true },
    expiresAt: { type: "number" },
  },
};
