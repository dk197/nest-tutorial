import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { SignInDto } from "src/auth/dtos/signin.dto";
import { UserService } from "src/users/providers/users.service";
import { SignInProvider } from "../sign-in.provider";
import { RefreshTokenDto } from "src/auth/dtos/refresh-token.dto";
import { RefreshTokensProvider } from "../refresh-tokens.provider";

@Injectable()
export class AuthService {
	constructor(
		@Inject(forwardRef(() => UserService))
		private readonly userService: UserService,
		private readonly signInProvider: SignInProvider,
		private readonly refreshTokensProvider: RefreshTokensProvider,
	) {}

	public async signIn(signInDto: SignInDto) {
		return await this.signInProvider.signIn(signInDto);
	}

	public async refreshTokens(refreshTokensDto: RefreshTokenDto) {
		return await this.refreshTokensProvider.refreshTokens(refreshTokensDto);
	}
}
