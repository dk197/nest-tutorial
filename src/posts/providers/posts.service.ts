import { BadRequestException, Body, Inject, Injectable, RequestTimeoutException } from "@nestjs/common";
import { UserService } from "src/users/providers/users.service";
import { CreatePostDto } from "../dtos/create-post.dto";
import { Repository } from "typeorm";
import { Post } from "../post.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { MetaOption } from "src/meta-options/meta-option.entity";
import { TagsService } from "src/tags/services/tags.service";
import { PatchPostDto } from "../dtos/patch-post.dto";
import { Tag } from "src/tags/tag.entity";
import { GetPostsDto } from "../dtos/get-posts-base.dto";
import { PaginationService } from "src/common/pagination/providers/pagination.service";
import { Paginated } from "src/common/pagination/interfaces/paginated.interface";

@Injectable()
export class PostsService {
	constructor(
		private readonly userService: UserService,
		private readonly tagsService: TagsService,
		@InjectRepository(Post)
		private readonly postRepository: Repository<Post>,
		@InjectRepository(MetaOption)
		private readonly metaOptionsRepository: Repository<MetaOption>,
		private readonly paginationService: PaginationService,
	) {}

	public async findAll(postQuery: GetPostsDto, userId: number): Promise<Paginated<Post>> {
		const posts = this.paginationService.paginateQuery<Post>(
			{
				limit: postQuery.limit,
				page: postQuery.page,
			},
			this.postRepository,
		);
		return posts;
	}

	public async create(@Body() createPostDto: CreatePostDto) {
		// without cascade
		// let metaOptions = createPostDto.metaOptions ? this.metaOptionsRepository.create(createPostDto.metaOptions) : null;
		// if (metaOptions) await this.metaOptionsRepository.save(metaOptions);
		// let post = this.postRepository.create({
		// 	...createPostDto,
		// 	metaOptions: metaOptions ?? undefined,
		// });
		// return await this.postRepository.save(post);

		const tags = await this.tagsService.findMultipleTags(createPostDto.tags ?? []);

		const author = await this.userService.findOneById(createPostDto.authorId);

		// with cascade
		const { metaOptions, ...rest } = createPostDto;
		let post = this.postRepository.create({
			...rest,
			metaOptions: metaOptions ?? undefined,
			author: author ?? undefined,
			tags: tags,
		});
		return await this.postRepository.save(post);
	}

	public async delete(id: number) {
		await this.postRepository.delete(id);
		return {
			deleted: true,
			id,
		};
	}

	public async update(patchPostDto: PatchPostDto) {
		let tags: Tag[] | null;
		let post: Post | null;

		try {
			tags = await this.tagsService.findMultipleTags(patchPostDto.tags ?? []);
		} catch (err) {
			throw new RequestTimeoutException("unable to process your request");
		}

		// number of tags must be equal to the result of the db
		if (patchPostDto.tags && patchPostDto.tags.length > 0 && !tags && patchPostDto.tags.length < patchPostDto.tags?.length)
			throw new BadRequestException("please check your tag ids");

		try {
			post = await this.postRepository.findOneBy({ id: patchPostDto.id });
		} catch (err) {
			throw new RequestTimeoutException("unable to process your request");
		}
		if (!post) throw new BadRequestException("post id was not found");

		post.title = patchPostDto.title ?? post.title;
		post.content = patchPostDto.content ?? post.content;
		post.status = patchPostDto.status ?? post.status;
		post.slug = patchPostDto.slug ?? post.slug;
		post.postType = patchPostDto.postType ?? post.postType;
		post.featuredImageUrl = patchPostDto.featuredImageUrl ?? post.featuredImageUrl;
		post.publishOn = patchPostDto.publishOn ?? post.publishOn;

		post.tags = tags;

		try {
			await this.postRepository.save(post);
		} catch (err) {
			throw new RequestTimeoutException("unable to process your request");
		}

		return post;
	}
}
