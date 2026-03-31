import { Body, Controller, Get, Param, Patch, Post } from "@nestjs/common";
import { PostsService } from "./providers/posts.service";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { CreatePostDto } from "./dtos/create-post.dto";
import { PatchPostDto } from "./dtos/patch-post.dto";

@Controller("posts")
@ApiTags("Posts")
export class PostsController {
	constructor(private readonly postsService: PostsService) {}

	@Get("/{:userId}")
	public getPosts(@Param("userId") userId: string) {
		return this.postsService.findAll(userId);
	}

	@ApiOperation({
		summary: "create a new post",
	})
	@ApiResponse({
		status: 201,
		description: "post was created successfully",
	})
	@Post()
	public createPost(@Body() createPostDto: CreatePostDto) {
		return "create post";
	}

	@ApiOperation({
		summary: "update a post",
	})
	@ApiResponse({
		status: 200,
		description: "post was updated successfully",
	})
	@Patch()
	public updatePost(@Body() patchPostsDto: PatchPostDto) {
		console.log(patchPostsDto);
	}
}
