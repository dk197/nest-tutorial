import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query } from "@nestjs/common";
import { PostsService } from "./providers/posts.service";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { CreatePostDto } from "./dtos/create-post.dto";
import { PatchPostDto } from "./dtos/patch-post.dto";
import { GetPostsDto } from "./dtos/get-posts-base.dto";

@Controller("posts")
@ApiTags("Posts")
export class PostsController {
	constructor(private readonly postsService: PostsService) {}

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
	public createPost(@Body() createPostDto: CreatePostDto) {
		return this.postsService.create(createPostDto);
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
