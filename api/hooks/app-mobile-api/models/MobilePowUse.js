/**
 * Solved CAPTCHA tasks. The task proves itself by its signature; this table only makes it single-use:
 * the second insert of the same id fails on the primary key, in whichever worker it happens.
 */
module.exports = {
  tableName: "mobile_pow_use",
  primaryKey: "id",
  attributes: {
    id: { type: "string", required: true },
    label: { type: "string", allowNull: true },
    expiresAt: { type: "number" },
  },
};
