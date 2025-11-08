import Settings from "../models/Settings";

export default interface RuntimeModule {
	module: {
		name: string
		version: string
		description: string
		main?: string
		appId?: string
		appName?: string
		icon?: string
		types?: string
		scripts?: {
			[key: string]: string
		}
		keywords?: string[],
		author?: string
		license?: string
		modulemanager?: {
			forbidDelete?: boolean
			moduleSpecificationVersion?: string
		}
		sails?: {
			isHook?: boolean
			hookName?: string
		}
		devDependencies?: {
			[key: string]: string
		}
		dependencies?: {
			[key: string]: string
		}
		webpacketmodule?: boolean
	}
	isSystemModule?: boolean
	repository?: string
	dirName?: string
	config?: {
		/**
		 * @deprecated may be redundant
		 * */
		settings?: {
			[key: string]: Partial<Settings>
		}
		installSteps?: InstallStepAbstract[]
	}
	hasUnfilledSettings?: boolean
	enable: boolean
	versionToUpdate?: string
	hasMigrations: boolean
}
