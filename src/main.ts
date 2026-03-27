import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	// use validationPipe globally
	app.useGlobalPipes(
		new ValidationPipe({
			whitelist: true, // remove fields that are not specified in dto
			forbidNonWhitelisted: true, // throw error if addidional property (not specified in dto) is sent
			transform: true, // transforms dtos to types in the controller
		})
	);
	await app.listen(process.env.PORT ?? 3333);
}
bootstrap();
