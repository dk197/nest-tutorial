import { Body, Controller, DefaultValuePipe, Get, Param, ParseIntPipe, Patch, Post, Query, ValidationPipe } from "@nestjs/common";
import { CreateUserDto } from "./dtos/create-user.dto";
import { GetUsersParamsDto } from "./dtos/get-users.params.dto";
import { PatchUserDto } from "./dtos/patch-user.dto";
import { UserService } from "./providers/users.service";

@Controller("users")
export class UsersController {
	constructor(private readonly userService: UserService) {}

	@Get("{/:id}")
	public getUsers(
		@Param() getUsersParamsDto: GetUsersParamsDto,
		@Query("page", new DefaultValuePipe(10), ParseIntPipe) page: number,
		@Query("limit", new DefaultValuePipe(1), ParseIntPipe) limit: number,
	) {
		return this.userService.findAll(getUsersParamsDto, limit, page);
	}

	@Post()
	public createUser(@Body() createUserDto: CreateUserDto) {
		console.log(createUserDto);
		return "create user";
	}

	@Patch()
	public patchUser(@Body() patchUserDto: PatchUserDto) {
		return patchUserDto;
	}
}
