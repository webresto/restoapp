import type { ModulesPort } from "../lib/types";
import { systemAdapter } from "./system";

/**
 * The modules of this server for the declaration.
 *
 * One function with «Система» (C38): the declaration and the app read the same rows of `Module`
 * joined with the same memory of the module manager, so what the app shows and what the declaration
 * names can never drift apart. Before this, the declaration was built from the memory of one worker
 * alone — a softly removed module stayed in it until a restart, and a module installed by another
 * worker was missing from it.
 *
 * Nothing here needs rights: a module list is what the server is, not what it holds. Which of them
 * brought an app the user may open is decided in `describe.ts`.
 */
export function sailsModules(sails: any): ModulesPort {
  return systemAdapter(sails);
}
