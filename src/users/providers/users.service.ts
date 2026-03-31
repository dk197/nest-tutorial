import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { GetUsersParamsDto } from "../dtos/get-users.params.dto";
import { AuthService } from "src/auth/providers/auth/auth.service";
import { Repository } from "typeorm";
import { User } from "../user.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { CreateUserDto } from "../dtos/create-user.dto";

@Injectable()
export class UserService {
	constructor(
		@Inject(forwardRef(() => AuthService))
		private readonly authService: AuthService,
		@InjectRepository(User)
		private usersRepository: Repository<User>,
	) {}

	public async createUser(createUserDto: CreateUserDto) {
		const existingUser = await this.usersRepository.findOne({
			where: {
				email: createUserDto.email,
			},
		});

		let newUser = this.usersRepository.create(createUserDto);
		newUser = await this.usersRepository.save(newUser);
		return newUser;
	}

	public findAll(getUserParamsDto: GetUsersParamsDto, limit: number, page: number) {
		const isAUth = this.authService.isAuthenticated();

		if (isAUth)
			return [
				{
					firstName: "John",
					email: "john@john.de",
				},
				{
					firstName: "Doe",
					email: "doe@doe.de",
				},
			];
	}

	public findOneById(id: string) {
		return {
			firstName: "Doe",
			email: "doe@doe.de",
		};
	}
}
