import { INestApplication } from "@nestjs/common";
import { App } from "supertest/types";
import { ConfigService } from "@nestjs/config";
import { dropDatabase } from "test/helpers/drop-database.helper";
import { bootstrapNestApp } from "test/helpers/bootstrap-nest-app.helper";
import supertest from "supertest";
import { completeUser, missingEmail, missingFirstName, missingPassword } from "./users.post.e2e-spec.sample-data";

describe("UsersController @Post Endpoints", () => {
	let app: INestApplication<App>;
	let config: ConfigService;
	let httpServer: App;

	beforeEach(async () => {
		app = await bootstrapNestApp();
		config = app.get<ConfigService>(ConfigService);
		httpServer = app.getHttpServer();
	});

	afterEach(async () => {
		await dropDatabase(config);
		await app.close();
	});

	it("/users - endpoint is public", () => {
		return supertest(httpServer)
			.post("/users")
			.send({})
			.expect(400)
			.then(({ body }) => {
				console.log(body);
			});
	});

	it("/users - firstName is mandatory", () => {
		return supertest(httpServer).post("/users").send(missingFirstName).expect(400);
	});

	it("/users - email is mandatory", () => {
		return supertest(httpServer).post("/users").send(missingEmail).expect(400);
	});

	it("/users - password is mandatory", () => {
		return supertest(httpServer).post("/users").send(missingPassword).expect(400);
	});

	it("/users - valid request -> create a user", () => {
		return supertest(httpServer)
			.post("/users")
			.send(completeUser)
			.expect(201)
			.then(({ body }) => {
				expect(body.data).toBeDefined();
				expect(body.data.firstName).toBe(completeUser.firstName);
				expect(body.data.lastName).toBe(completeUser.lastName);
				expect(body.data.email).toBe(completeUser.email);
			});
	});

	it("/users - valid request -> should not return password or google id", () => {
		return supertest(httpServer)
			.post("/users")
			.send(completeUser)
			.expect(201)
			.then(({ body }) => {
				expect(body.data).toBeDefined();
				expect(body.data.password).toBeUndefined();
				expect(body.data.googleId).toBeUndefined();
			});
	});
});
