import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { GetUsersParamsDto } from "../dtos/get-users.params.dto";
import { AuthService } from "src/auth/providers/auth/auth.service";

@Injectable()
export class UserService {
	constructor(
		@Inject(forwardRef(() => AuthService))
		private readonly authService: AuthService,
	) {}
	public findAll(getUserParamsDto: GetUsersParamsDto, limit: number, page: number) {
		const isAUth = this.authService.isAuthenticated();

		if (isAUth)
			return [
				{
					firstName: "John",
					email: "john@john.de",
				},
				{
					firstName: "Doe",
					email: "doe@doe.de",
				},
			];
	}

	public findOneById(id: string) {
		return {
			firstName: "Doe",
			email: "doe@doe.de",
		};
	}
}
