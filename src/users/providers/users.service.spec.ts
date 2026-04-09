import { Test, TestingModule } from "@nestjs/testing";

import { CreateGoogleUserProvider } from "./create-google-user.provider";
import { CreateUserProvider } from "./create-user.provider";
import { DataSource } from "typeorm";
import { FindOneByGoogleIdProvider } from "./find-one-by-google-id.provider";
import { FindOneUserByEmailProvider } from "./find-one-user-by-email.provider";
import { User } from "../user.entity";
import { UsersCreateManyProvider } from "./users-create-many.provider";
import { getRepositoryToken } from "@nestjs/typeorm";
import { UserService } from "./users.service";
import { CreateUserDto } from "../dtos/create-user.dto";

describe("UserService", () => {
	let service: UserService;

	beforeEach(async () => {
		const mockCreateUserProvider: Partial<CreateUserProvider> = {
			createUser: (createUserDto: CreateUserDto) =>
				Promise.resolve({
					id: 1,
					firstName: createUserDto.firstName,
					lastName: createUserDto.lastName,
					email: createUserDto.email,
					password: createUserDto.password,
				}),
		};

		const module: TestingModule = await Test.createTestingModule({
			providers: [
				UserService,
				{ provide: CreateUserProvider, useValue: mockCreateUserProvider },
				{ provide: DataSource, useValue: {} },
				{ provide: getRepositoryToken(User), useValue: {} },
				{ provide: UsersCreateManyProvider, useValue: {} },
				{ provide: FindOneUserByEmailProvider, useValue: {} },
				{ provide: FindOneByGoogleIdProvider, useValue: {} },
				{ provide: CreateGoogleUserProvider, useValue: {} },
			],
		}).compile();

		service = module.get<UserService>(UserService);
	});

	it("Should be defined", () => {
		expect(service).toBeDefined();
	});

	describe("CreateUser", () => {
		it("should be defined", () => {
			expect(service.createUser).toBeDefined();
		});

		it("should call createUser on CreateUserProvider", async () => {
			let user = await service.createUser({
				firstName: "test",
				lastName: "tset",
				email: "test@test.de",
				password: "test123@",
			});

			expect(user.firstName).toEqual("test");
		});
	});
});
