export interface Category {
    id: string
    name: string
}

export interface Module {
    id: string
    name: string
    description: string
    icon: string
    lastPublish: number
    /**
     * Price is only for displaying, not for logic
     * */
    price?: string
    categories: string[]
    copying: string
    author: string
    tags: string[]
    /**
     * is ready by default
     * */
    isReadyForDownload?: boolean
    /**
     * If forSale is undefined, module is for free
     * */
    forSale?: boolean
    /**
     * For free modules this field is not required
     * */
    purchased?: boolean
    disabled: boolean
    /**
     * Latest semantic version of main branch
     * */
    latestVersion: string
    supportLink?: string
    /**
     * If isReadyForDownload is true, package is required
     * */
    packageLink?: string
    appDependencies: {
        /**
         * Value is semantic version
         * */
        [key:string]: string
    }
    installed: boolean
}

export interface Config {
    locale?: string
    country?: string
    secret?: string
    repository?: {
        id: string
        name: string
        link: string
        type: "storage" | "github" | "local"
    }
    repositories?: {
        id: string
        name: string
        link: string
        type: "storage" | "github" | "local"
    }[],
    state?: {
        restartRequired: boolean
        unknownError: boolean
        notAvailableMarket: boolean
        noModulesFound: boolean
        addNewModule: boolean
    },
    modules?: any
    system?: any
    modulesPath?: string
    tempDirPath?: string
    migrationsConfigPath?: string
    navbar?: NavItem[]
    token: string
}

interface NavItem {
    id: string
    name: string
    link: string
    icon: string
}

export interface DetailedModule extends Module {
    galleries: string[]
    updates: string
    missingDependencies: {[key: string]: string}
    buyLink: string
}
