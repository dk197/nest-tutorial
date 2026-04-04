import { Inject, Injectable } from "@nestjs/common";
import { PaginationQueryDto } from "../dtos/pagination-query.dto";
import { ObjectLiteral, Repository } from "typeorm";
import { type Request } from "express";
import { REQUEST } from "@nestjs/core";
import { Paginated } from "../interfaces/paginated.interface";

@Injectable()
export class PaginationService {
	constructor(
		@Inject(REQUEST)
		private readonly request: Request,
	) {}
	public async paginateQuery<T extends ObjectLiteral>(paginationQuery: PaginationQueryDto, repository: Repository<T>): Promise<Paginated<T>> {
		const results = await repository.find({
			take: paginationQuery.limit,
			skip: (paginationQuery.page - 1) * paginationQuery.limit,
		});

		const baseUrl = this.request.protocol + "://" + this.request.headers.host + "/";
		const newUrl = new URL(this.request.url, baseUrl);

		const totalItems = await repository.count();
		const totalPages = Math.ceil(totalItems / paginationQuery.limit);
		const nextPage = paginationQuery.page === totalPages ? paginationQuery.page : paginationQuery.page + 1;
		const previousPage = paginationQuery.page === 1 ? paginationQuery.page : paginationQuery.page - 1;

		const finalResponse: Paginated<T> = {
			data: results,
			meta: {
				itemsPerPage: paginationQuery.limit,
				totalItems: totalItems,
				currentPage: paginationQuery.page,
				totalPages: totalPages,
			},
			links: {
				first: `${newUrl.origin}${newUrl.pathname}?limit=${paginationQuery.limit}&page=1`,
				last: `${newUrl.origin}${newUrl.pathname}?limit=${paginationQuery.limit}&page=${totalPages}`,
				current: `${newUrl.origin}${newUrl.pathname}?limit=${paginationQuery.limit}&page=${paginationQuery.page}`,
				next: `${newUrl.origin}${newUrl.pathname}?limit=${paginationQuery.limit}&page=${nextPage}`,
				previous: `${newUrl.origin}${newUrl.pathname}?limit=${paginationQuery.limit}&page=${previousPage}`,
			},
		};

		return finalResponse;
	}
}
