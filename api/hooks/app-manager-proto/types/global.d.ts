import sails from "sails-typescript";
import { ModuleManagerConfig } from "./mmConfig";
type sailsConfig = typeof sails.config;
declare global {
    interface _sailsConfig extends sailsConfig {
        modulemanager: ModuleManagerConfig;
    }
}
export {};
