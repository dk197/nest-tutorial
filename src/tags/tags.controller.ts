import { Body, Controller, Delete, ParseIntPipe, Post, Query } from "@nestjs/common";
import { CreateTagDto } from "./dtos/create-tag.dto";
import { TagsService } from "./services/tags.service";

@Controller("tags")
export class TagsController {
	constructor(private readonly tagsService: TagsService) {}

	@Post()
	public async create(@Body() createTagDto: CreateTagDto) {
		return this.tagsService.create(createTagDto);
	}

	@Delete()
	public async delete(@Query("id", ParseIntPipe) id: number) {
		return this.tagsService.delete(id);
	}

	@Delete("soft")
	public async softDelete(@Query("id", ParseIntPipe) id: number) {
		return this.tagsService.softDelete(id);
	}
}
