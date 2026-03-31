import { Injectable } from "@nestjs/common";
import { UserService } from "src/users/providers/users.service";

@Injectable()
export class PostsService {
	constructor(private readonly userService: UserService) {}
	public findAll(userId: string) {
		const user = this.userService.findOneById(userId);
		return [
			{
				user: user,
				title: "title",
				content: "content",
			},
			{
				user: user,
				title: "title2",
				content: "content2",
			},
		];
	}
}
