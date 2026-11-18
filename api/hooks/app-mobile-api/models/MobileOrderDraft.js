/**
 * An order a member of staff is still assembling on a terminal (order-entry.plan.md, «Черновики»).
 *
 * The order itself is core's, in NEW / CART / CHECKOUT — this table only remembers *whose* it is and
 * which point it was started at, because a cart of core carries neither. Rows live until the order
 * is placed or dropped, and the hook's hourly cleanup removes the rest.
 */
module.exports = {
  tableName: "mobile_order_draft",
  primaryKey: "id",
  attributes: {
    id: { type: "string", required: true },
    /** `order.id` of core. */
    order: { type: "string", required: true, unique: true },
    /** The panel user who started it. */
    user: { type: "string", required: true },
    /** The device it was started on; null once that device is gone. */
    device: { type: "string", allowNull: true },
    /** The point the order is taken for: `place.id`. */
    place: { type: "string", required: true },
    createdAt: { type: "number" },
    updatedAt: { type: "number" },
  },
};
