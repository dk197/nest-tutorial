import { BadRequestException, Body, ConflictException, Injectable } from "@nestjs/common";
import { CreatePostDto } from "../dtos/create-post.dto";
import { TagsService } from "src/tags/services/tags.service";
import { UserService } from "src/users/providers/users.service";
import { Post } from "../post.entity";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { ActiveUserData } from "src/auth/interfaces/active-user-data.interface";
import { Tag } from "src/tags/tag.entity";
import { User } from "src/users/user.entity";

@Injectable()
export class CreatePostProvider {
	constructor(
		@InjectRepository(Post)
		private readonly postRepository: Repository<Post>,
		private readonly tagsService: TagsService,
		private readonly userService: UserService,
	) {}

	public async create(createPostDto: CreatePostDto, user: ActiveUserData) {
		// without cascade
		// let metaOptions = createPostDto.metaOptions ? this.metaOptionsRepository.create(createPostDto.metaOptions) : null;
		// if (metaOptions) await this.metaOptionsRepository.save(metaOptions);
		// let post = this.postRepository.create({
		// 	...createPostDto,
		// 	metaOptions: metaOptions ?? undefined,
		// });
		// return await this.postRepository.save(post);

		let tags: Tag[] | null;
		let author: User | null;

		try {
			tags = await this.tagsService.findMultipleTags(createPostDto.tags ?? []);
			author = await this.userService.findOneById(user.sub);
		} catch (err) {
			throw new ConflictException(err);
		}

		if (!author) throw new BadRequestException();

		if (createPostDto.tags?.length !== tags.length) {
			throw new BadRequestException("please check your tag ids");
		}

		// with cascade
		const { metaOptions, ...rest } = createPostDto;
		let post = this.postRepository.create({
			...rest,
			metaOptions: metaOptions ?? undefined,
			author: author ?? undefined,
			tags: tags,
		});

		try {
			return await this.postRepository.save(post);
		} catch (err) {
			throw new ConflictException(err, {
				description: "ensure slug is unique",
			});
		}
	}
}
