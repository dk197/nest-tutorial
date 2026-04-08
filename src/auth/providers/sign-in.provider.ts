import { forwardRef, Inject, Injectable, RequestTimeoutException, UnauthorizedException } from "@nestjs/common";
import { SignInDto } from "../dtos/signin.dto";
import { UserService } from "src/users/providers/users.service";
import { HashingProvider } from "./hashing.provider";
import { GenerateTokensProvider } from "./generate-tokens.provider";

@Injectable()
export class SignInProvider {
	constructor(
		@Inject(forwardRef(() => UserService))
		private readonly usersService: UserService,
		private readonly hashingProvider: HashingProvider,
		private readonly generateTokensProvider: GenerateTokensProvider,
	) {}

	public async signIn(signInDto: SignInDto) {
		let user = await this.usersService.findOneByEmail(signInDto.email);
		let isEqual: boolean = false;

		try {
			if (!user.password) throw new Error("no pw");
			isEqual = await this.hashingProvider.comparePassword(signInDto.password, user.password);
		} catch (err) {
			throw new RequestTimeoutException(err, {
				description: "could not compare passwords",
			});
		}

		if (!isEqual) throw new UnauthorizedException("incorrect password");

		return await this.generateTokensProvider.generateTokens(user);
	}
}
