import { ConfigService } from "@nestjs/config";
import { DataSource } from "typeorm";

export async function dropDatabase(config: ConfigService): Promise<void> {
	const AppDataSource = await new DataSource({
		type: "postgres",
		synchronize: config.get("database.synchronize"),
		port: +config.get("database.port"),
		username: config.get("database.user"),
		password: config.get("database.password"),
		host: config.get("database.host"),
		database: config.get("database.name"),
	}).initialize();

	// drop all tables
	await AppDataSource.dropDatabase();

	// close connection
	await AppDataSource.destroy();
}
