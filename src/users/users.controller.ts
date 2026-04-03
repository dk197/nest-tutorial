import { Body, Controller, DefaultValuePipe, Get, Param, ParseIntPipe, Patch, Post, Query, ValidationPipe } from "@nestjs/common";
import { CreateUserDto } from "./dtos/create-user.dto";
import { GetUsersParamsDto } from "./dtos/get-users.params.dto";
import { PatchUserDto } from "./dtos/patch-user.dto";
import { UserService } from "./providers/users.service";
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from "@nestjs/swagger";
import { CreateManyUsersDto } from "./dtos/create-many-users.dto";

@Controller("users")
@ApiTags("Users")
export class UsersController {
	constructor(private readonly userService: UserService) {}

	@Get("{/:id}")
	@ApiOperation({
		summary: "fetch a list of users",
	})
	@ApiResponse({
		status: 200,
		description: "users fetched successfully based on the query",
	})
	@ApiQuery({
		name: "limit",
		type: "number",
		required: false,
		description: "number of entries returned per query",
		example: 10,
	})
	@ApiQuery({
		name: "page",
		type: "number",
		required: false,
		description: "the position of the page number",
		example: 1,
	})
	public getUsers(
		@Param() getUsersParamsDto: GetUsersParamsDto,
		@Query("page", new DefaultValuePipe(10), ParseIntPipe) page: number,
		@Query("limit", new DefaultValuePipe(1), ParseIntPipe) limit: number,
	) {
		return this.userService.findAll(getUsersParamsDto, limit, page);
	}

	@Post()
	public createUser(@Body() createUserDto: CreateUserDto) {
		return this.userService.createUser(createUserDto);
	}

	@Post("create-many")
	public createManyUsers(@Body() createManyUsersDto: CreateManyUsersDto) {
		return this.userService.createMany(createManyUsersDto);
	}

	@Patch()
	public patchUser(@Body() patchUserDto: PatchUserDto) {
		return patchUserDto;
	}
}
