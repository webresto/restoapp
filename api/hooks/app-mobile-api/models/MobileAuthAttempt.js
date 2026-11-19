/**
 * Login attempts by label (`login:<ip>`, `user:<login>`): the rate limits and the CAPTCHA difficulty,
 * counted in the database so that every worker of the cluster sees the same numbers.
 */
module.exports = {
  tableName: "mobile_auth_attempt",
  // Not in the storefront's GraphQL: the mobile API's own records (devices, sign-in attempts, drafts) are
  // nobody's public data — and a `userap` link has no type there, so the schema would not even build.
  graphql: { public: false },
  attributes: {
    label: { type: "string", required: true },
    at: { type: "number", required: true },
    ok: { type: "boolean", defaultsTo: false },
  },
};
