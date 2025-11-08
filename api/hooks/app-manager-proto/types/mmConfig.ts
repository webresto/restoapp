export interface NavbarItem {
	id: string;
	name: string;
	link: string;
	icon: string;
}

export interface Repository {
	id: string;
	name: string;
	link: string;
	type: 'local' | 'github' | 'storage';
}

export interface ModuleManagerConfig {
	navbar?: NavbarItem[]
	repositories?: Repository[]
	state?: {
		addNewModule?: boolean
		noModulesFound?: boolean
		restartRequired?: boolean
		notAvailableMarket?: boolean
		unknownError?: boolean
	}
	tempDirPath?: string
	modulesPath?: string
	secret?: string
	migrationsConfigPath?: string
	navbarHelper?: () => NavbarItem[]
}
