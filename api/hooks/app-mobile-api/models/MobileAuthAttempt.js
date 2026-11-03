/**
 * Login attempts by label (`login:<ip>`, `user:<login>`): the rate limits and the CAPTCHA difficulty,
 * counted in the database so that every worker of the cluster sees the same numbers.
 */
module.exports = {
  tableName: "mobile_auth_attempt",
  attributes: {
    label: { type: "string", required: true },
    at: { type: "number", required: true },
    ok: { type: "boolean", defaultsTo: false },
  },
};
