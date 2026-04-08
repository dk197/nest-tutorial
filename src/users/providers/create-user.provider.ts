import { BadRequestException, forwardRef, Inject, Injectable, RequestTimeoutException } from "@nestjs/common";
import { User } from "../user.entity";
import { CreateUserDto } from "../dtos/create-user.dto";
import { Repository } from "typeorm";
import { HashingProvider } from "src/auth/providers/hashing.provider";
import { InjectRepository } from "@nestjs/typeorm";
import { MailService } from "src/mail/providers/mail.service";

@Injectable()
export class CreateUserProvider {
	constructor(
		@InjectRepository(User)
		private readonly usersRepository: Repository<User>,
		@Inject(forwardRef(() => HashingProvider))
		private readonly hashingProvider: HashingProvider,
		private readonly mailService: MailService,
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
			console.log("err at sending email", err);
			throw new RequestTimeoutException("unable to process your request at the moment, please try later", {
				description: "error connecting to the database",
			});
		}

		try {
			await this.mailService.sendUserWelcome(newUser);
		} catch (err) {
			throw new RequestTimeoutException(err);
		}

		return newUser;
	}
}
