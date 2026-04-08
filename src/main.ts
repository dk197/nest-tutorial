import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	// use validationPipe globally
	app.useGlobalPipes(
		new ValidationPipe({
			whitelist: true, // remove fields that are not specified in dto
			forbidNonWhitelisted: true, // throw error if addidional property (not specified in dto) is sent
			transform: true, // transforms dtos to types in the controller
			transformOptions: {
				enableImplicitConversion: true, // validation pipe converts type
			},
		}),
	);

	// swagger config
	const config = new DocumentBuilder()
		.setVersion("1.0")
		.setTitle("Blog API Documentation")
		.setDescription("Use the base API URL as http://localhost:3333")
		.setTermsOfService("http://dkdev.de/terms-of-service")
		.setLicense("MIT License", "http://dkdev.de/mit")
		.addServer("http://localhost:3333")
		.build();
	const document = SwaggerModule.createDocument(app, config);
	SwaggerModule.setup("swagger", app, document);

	//enable cors
	app.enableCors();

	await app.listen(process.env.PORT ?? 3333);
}

bootstrap();
