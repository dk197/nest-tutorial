import { IsInt, IsNotEmpty } from "class-validator";
import { CreatePostDto } from "./create-post.dto";
import { ApiProperty, PartialType } from "@nestjs/swagger";

// import all fields from CreatePostDto but make them all optional
// -> import PartialType from swagger to inherit swagger specs from CreatePostDto
export class PatchPostDto extends PartialType(CreatePostDto) {
	@ApiProperty({
		description: "ID of the post that should be updated",
	})
	@IsInt()
	@IsNotEmpty()
	id: number;
}
