import { Body, Inject, Injectable } from "@nestjs/common";
import { UserService } from "src/users/providers/users.service";
import { CreatePostDto } from "../dtos/create-post.dto";
import { Repository } from "typeorm";
import { Post } from "../post.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { MetaOption } from "src/meta-options/meta-option.entity";
import { TagsService } from "src/tags/services/tags.service";
import { PatchPostDto } from "../dtos/patch-post.dto";

@Injectable()
export class PostsService {
	constructor(
		private readonly userService: UserService,
		private readonly tagsService: TagsService,
		@InjectRepository(Post)
		private readonly postRepository: Repository<Post>,
		@InjectRepository(MetaOption)
		private readonly metaOptionsRepository: Repository<MetaOption>,
	) {}

	public async findAll(userId: number) {
		const posts = await this.postRepository.find({
			// to fetch related docs or put eager: true, into @OneToOne inside the entity
			// relations: {
			// 	metaOptions: true,
			// 	author: true,
			// },
		});
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

		const author = await this.userService.findOneById(createPostDto.authorId);

		const tags = await this.tagsService.findMultipleTags(createPostDto.tags ?? []);

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
		const tags = await this.tagsService.findMultipleTags(patchPostDto.tags ?? []);
		const post = await this.postRepository.findOneBy({ id: patchPostDto.id });
		if (!post) return;
		post.title = patchPostDto.title ?? post.title;
		post.content = patchPostDto.content ?? post.content;
		post.status = patchPostDto.status ?? post.status;
		post.slug = patchPostDto.slug ?? post.slug;
		post.postType = patchPostDto.postType ?? post.postType;
		post.featuredImageUrl = patchPostDto.featuredImageUrl ?? post.featuredImageUrl;
		post.publishOn = patchPostDto.publishOn ?? post.publishOn;

		post.tags = tags;

		return await this.postRepository.save(post);
	}
}
