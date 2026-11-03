import Ajv, { ValidateFunction } from "ajv";

/** Validators of the protocol's own bodies, straight from the contract file the client shares. */
export const contract = require("../schema/declaration.schema.json");

const ajv = new Ajv({ strict: false, allErrors: true });
ajv.addSchema(contract);

export function contractValidator(definition: string): ValidateFunction {
  const validate = ajv.getSchema(`${contract.$id}#/definitions/${definition}`);
  if (!validate) throw new Error(`mobile API contract has no definition "${definition}"`);
  return validate;
}
