// types/db-migrate.d.ts
declare module 'db-migrate' {
	interface DBMigrateInstance {
		up(): Promise<void>;
		down(): Promise<void>;
	}

	interface DBMigrateFactoryOptions {
		cwd: string;
		config: string;
		env: string;
	}

	function getInstance(isModule: boolean, options: DBMigrateFactoryOptions): DBMigrateInstance;

	export { getInstance, DBMigrateInstance, DBMigrateFactoryOptions };
}
