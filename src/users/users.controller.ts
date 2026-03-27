import { Body, Controller, DefaultValuePipe, Get, Param, ParseIntPipe, Patch, Post, Query, ValidationPipe } from "@nestjs/common";
import { CreateUserDto } from "./dtos/create-user.dto";
import { GetUsersParamsDto } from "./dtos/get-users.params.dto";
import { PatchUserDto } from "./dtos/patch-user.dto";

@Controller("users")
export class UsersController {
	@Get("{/:id}")
	public getUsers(
		@Param() getUsersParamsDto: GetUsersParamsDto,
		@Query("page", new DefaultValuePipe(10), ParseIntPipe) page: number,
		@Query("limit", new DefaultValuePipe(1), ParseIntPipe) limit: number
	) {
		console.log(getUsersParamsDto);
		console.log(limit, typeof limit);
		console.log(page, typeof page);
		return "get to users endpoint";
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
