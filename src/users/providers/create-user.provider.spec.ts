import { DataSource, ObjectLiteral, Repository } from "typeorm";
import { Test, TestingModule } from "@nestjs/testing";

import { CreateUserProvider } from "./create-user.provider";
import { HashingProvider } from "src/auth/providers/hashing.provider";
import { MailService } from "src/mail/providers/mail.service";
import { User } from "../user.entity";
import { getRepositoryToken } from "@nestjs/typeorm";
import { BadRequestException } from "@nestjs/common";

type MockRepository<T extends ObjectLiteral = ObjectLiteral> = Partial<Record<keyof Repository<T>, jest.Mock>>;
const createMockRepository = <T extends ObjectLiteral = ObjectLiteral>(): MockRepository<T> => ({
	findOne: jest.fn(),
	create: jest.fn(),
	save: jest.fn(),
});

describe("CreateUserProvider", () => {
	let provider: CreateUserProvider;
	let usersRepository: MockRepository;
	const user = {
		firstName: "test",
		lastName: "tset",
		email: "test@test.de",
		password: "password",
	};

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				CreateUserProvider,
				{ provide: DataSource, useValue: {} },
				{ provide: getRepositoryToken(User), useValue: createMockRepository() },
				{
					provide: HashingProvider,
					useValue: {
						hashPassword: jest.fn(() => user.password),
					},
				},
				{
					provide: MailService,
					useValue: {
						sendUserWelcome: jest.fn(() => Promise.resolve()),
					},
				},
			],
		}).compile();

		provider = module.get<CreateUserProvider>(CreateUserProvider);
		usersRepository = module.get(getRepositoryToken(User));
	});

	it("should Be Defined", () => {
		expect(provider).toBeDefined();
	});

	describe("createUser", () => {
		describe("when the user does not exist in the db", () => {
			it("should create the new user", async () => {
				usersRepository.findOne?.mockReturnValue(null);
				usersRepository.create?.mockReturnValue(user);
				usersRepository.save?.mockReturnValue(user);
				const newUser = await provider.createUser(user);
				expect(usersRepository.findOne).toHaveBeenCalledWith({ where: { email: user.email } });
				expect(usersRepository.create).toHaveBeenCalledWith(user);
				expect(usersRepository.save).toHaveBeenCalledWith(user);
			});
		});

		describe("when the user exists in the db already", () => {
			it("should throw a BadRequestException", async () => {
				usersRepository.findOne?.mockReturnValue(user.email);
				usersRepository.create?.mockReturnValue(user);
				usersRepository.save?.mockReturnValue(user);
				try {
					const newUser = await provider.createUser(user);
				} catch (err) {
					expect(err).toBeInstanceOf(BadRequestException);
				}
			});
		});
	});
});
