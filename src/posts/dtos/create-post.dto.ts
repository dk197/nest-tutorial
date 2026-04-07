import {
	IsArray,
	IsEnum,
	IsInt,
	IsISO8601,
	IsJSON,
	IsNotEmpty,
	IsOptional,
	IsString,
	IsUrl,
	Matches,
	MaxLength,
	MinLength,
	ValidateNested,
} from "class-validator";
import { Type } from "class-transformer";
import { CreatePostMetaOptionsDto } from "../../meta-options/dtos/create-post-meta-options.dto";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { PostType } from "../enums/postType.enum";
import { PostStatus } from "../enums/postStatus.enum";

export class CreatePostDto {
	@ApiProperty()
	@IsString()
	@MinLength(4)
	@MaxLength(512)
	@IsNotEmpty()
	title!: string;

	@ApiProperty({
		enum: PostType,
		description: "Possible values  'post', 'page', 'story', 'series'",
	})
	@IsEnum(PostType)
	@IsNotEmpty()
	postType!: PostType;

	@ApiProperty({
		description: "For example 'my-url'",
	})
	@IsString()
	@MaxLength(256)
	@IsNotEmpty()
	@Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
		message: 'A slug should be all small letters and uses only "-" and without spaces. For example "my-url"',
	})
	slug?: string;

	@ApiProperty({
		enum: PostStatus,
		description: "Possible values 'draft', 'scheduled', 'review', 'published'",
	})
	@IsEnum(PostStatus)
	@IsNotEmpty()
	status!: PostStatus;

	@ApiPropertyOptional()
	@IsOptional()
	@IsString()
	content?: string;

	@ApiPropertyOptional({
		description: "Serialize your JSON object else a validation error will be thrown",
	})
	@IsOptional()
	@IsJSON()
	schema?: string;

	@ApiPropertyOptional()
	@IsOptional()
	@MaxLength(1024)
	@IsUrl()
	featuredImageUrl?: string;

	@ApiProperty({
		description: "Must be a valid timestamp in ISO8601",
		example: "2024-03-16T07:46:32+0000",
	})
	@IsISO8601()
	@IsOptional()
	publishOn?: Date;

	@ApiPropertyOptional({
		description: "an array of tag ids",
		example: [1, 2],
	})
	@IsArray()
	@IsOptional()
	@IsInt({ each: true })
	tags?: number[];

	@ApiPropertyOptional({
		type: () => CreatePostMetaOptionsDto,
	})
	@IsOptional()
	@ValidateNested({ each: true })
	@Type(() => CreatePostMetaOptionsDto)
	metaOptions?: CreatePostMetaOptionsDto | null;
}
