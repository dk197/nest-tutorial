import { IntersectionType } from "@nestjs/swagger";
import { IsDate, IsOptional } from "class-validator";
import { PaginationQueryDto } from "src/common/pagination/dtos/pagination-query.dto";

class GetPoststBaseDto {
	@IsDate()
	@IsOptional()
	startDate?: Date;

	@IsDate()
	@IsOptional()
	endDate?: Date;
}

// combine 2 dtos
export class GetPostsDto extends IntersectionType(GetPoststBaseDto, PaginationQueryDto) {}
