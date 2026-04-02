import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { UserService } from "src/users/providers/users.service";

@Injectable()
export class AuthService {
	constructor(
		@Inject(forwardRef(() => UserService))
		private readonly userService: UserService,
	) {}
	public login(email: string, password: string, id: number) {
		const user = this.userService.findOneById(id);
		return "token";
	}

	public isAuthenticated() {
		return true;
	}
}
