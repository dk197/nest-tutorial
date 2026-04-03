import { BadRequestException, forwardRef, HttpException, HttpStatus, Inject, Injectable, RequestTimeoutException } from "@nestjs/common";
import { GetUsersParamsDto } from "../dtos/get-users.params.dto";
import { AuthService } from "src/auth/providers/auth/auth.service";
import { Repository } from "typeorm";
import { User } from "../user.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { CreateUserDto } from "../dtos/create-user.dto";
import { type ConfigType } from "@nestjs/config";
import profileConfig from "../config/profile.config";
import { UsersCreateManyProvider } from "./users-create-many.provider";
import { CreateManyUsersDto } from "../dtos/create-many-users.dto";

/**
 * Class to connect to user table
 */
@Injectable()
export class UserService {
	constructor(
		@Inject(forwardRef(() => AuthService))
		private readonly authService: AuthService,
		@InjectRepository(User)
		private usersRepository: Repository<User>,
		@Inject(profileConfig.KEY)
		private readonly profileConfigurarion: ConfigType<typeof profileConfig>,
		private readonly usersCreateManyProvider: UsersCreateManyProvider,
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

		let newUser = this.usersRepository.create(createUserDto);
		try {
			newUser = await this.usersRepository.save(newUser);
		} catch (err) {
			throw new RequestTimeoutException("unable to process your request at the moment, please try later", {
				description: "error connecting to the database",
			});
		}
		return newUser;
	}

	public findAll(getUserParamsDto: GetUsersParamsDto, limit: number, page: number) {
		// custom exception
		throw new HttpException(
			{
				status: HttpStatus.MOVED_PERMANENTLY,
				error: "api endpoint does not exist",
				fileName: "users.service.ts",
			},
			HttpStatus.MOVED_PERMANENTLY,
			// 3rd arg is not sent to the user
			{
				description: "occurred because the api endpoint was permanently moved",
				cause: new Error(),
			},
		);
		// const isAUth = this.authService.isAuthenticated();
		// console.log(this.profileConfigurarion);
		// if (isAUth)
		// 	return [
		// 		{
		// 			firstName: "John",
		// 			email: "john@john.de",
		// 		},
		// 		{
		// 			firstName: "Doe",
		// 			email: "doe@doe.de",
		// 		},
		// 	];
	}

	public async findOneById(id: number) {
		let user: User | null;
		try {
			user = await this.usersRepository.findOneBy({ id });
		} catch (err) {
			throw new RequestTimeoutException("unable to process your request at the moment, please try later", {
				description: "error connecting to the database",
			});
		}

		if (!user) throw new BadRequestException("user id does not exist");

		return user;
	}

	public async createMany(createManyUsersDto: CreateManyUsersDto) {
		return await this.usersCreateManyProvider.createMany(createManyUsersDto);
	}
}
