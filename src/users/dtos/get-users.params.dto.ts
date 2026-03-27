import { Type } from "class-transformer";
import { IsInt, IsOptional } from "class-validator";

export class GetUsersParamsDto {
	@IsOptional()
	@IsInt()
	@Type(() => Number)
	id?: number;
}
