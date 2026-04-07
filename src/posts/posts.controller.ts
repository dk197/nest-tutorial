import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, Req } from "@nestjs/common";
import { PostsService } from "./providers/posts.service";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { CreatePostDto } from "./dtos/create-post.dto";
import { PatchPostDto } from "./dtos/patch-post.dto";
import { GetPostsDto } from "./dtos/get-posts-base.dto";
import { REQUEST_USER_KEY } from "src/auth/constants/auth.constants";
import { ActiveUser } from "src/auth/decorators/active-user.decorator";
import { type ActiveUserData } from "src/auth/interfaces/active-user-data.interface";
import { CreatePostProvider } from "./providers/create.post.provider";

@Controller("posts")
@ApiTags("Posts")
export class PostsController {
	constructor(
		private readonly postsService: PostsService,
		private readonly createPostProvider: CreatePostProvider,
	) {}

	@Get("/{:userId}")
	public getPosts(@Param("userId") userId: number, @Query() postQuery: GetPostsDto) {
		console.log(postQuery);
		return this.postsService.findAll(postQuery, userId);
	}

	@ApiOperation({
		summary: "create a new post",
	})
	@ApiResponse({
		status: 201,
		description: "post was created successfully",
	})
	@Post()
	public async createPost(@Body() createPostDto: CreatePostDto, @ActiveUser() user: ActiveUserData) {
		return await this.createPostProvider.create(createPostDto, user);
	}

	@ApiOperation({
		summary: "update a post",
	})
	@ApiResponse({
		status: 200,
		description: "post was updated successfully",
	})
	@Patch()
	public updatePost(@Body() patchPostDto: PatchPostDto) {
		return this.postsService.update(patchPostDto);
	}

	@Delete()
	public deletePost(@Query("id", ParseIntPipe) id: number) {
		return this.postsService.delete(id);
	}
}
