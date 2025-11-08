import {NavbarItem} from "../types/mmConfig";

export default function navbarHelper(): NavbarItem[] {
    return sails.config.modulemanager.navbar
}
