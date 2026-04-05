import { BadRequestException, forwardRef, Inject, Injectable, RequestTimeoutException } from "@nestjs/common";
import { User } from "../user.entity";
import { CreateUserDto } from "../dtos/create-user.dto";
import { Repository } from "typeorm";
import { HashingProvider } from "src/auth/providers/hashing.provider";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class CreateUserProvider {
	constructor(
		@InjectRepository(User)
		private readonly usersRepository: Repository<User>,
		@Inject(forwardRef(() => HashingProvider))
		private readonly hashingProvider: HashingProvider,
	) {}

	public async createUser(createUserDto: CreateUserDto) {
		let existingUser: User | null;
		try {
			existingUser = await this.usersRepository.findOne({
				where: {
					email: createUserDto.email,
				},
			});
		} catch (err) {
			throw new RequestTimeoutException("unable to process your request at the moment, please try later", {
				description: "error connecting to the database",
			});
		}

		if (existingUser) throw new BadRequestException("user already exists");

		let newUser = this.usersRepository.create({
			...createUserDto,
			password: await this.hashingProvider.hashPassword(createUserDto.password),
		});

		try {
			newUser = await this.usersRepository.save(newUser);
		} catch (err) {
			throw new RequestTimeoutException("unable to process your request at the moment, please try later", {
				description: "error connecting to the database",
			});
		}
		return newUser;
	}
}
