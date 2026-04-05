import { forwardRef, Inject, Injectable, RequestTimeoutException, UnauthorizedException } from "@nestjs/common";
import { SignInDto } from "../dtos/signin.dto";
import { UserService } from "src/users/providers/users.service";
import { HashingProvider } from "./hashing.provider";
import { JwtService } from "@nestjs/jwt";
import { type ConfigType } from "@nestjs/config";
import jwtConfig from "../config/jwt.config";

@Injectable()
export class SignInProvider {
	constructor(
		@Inject(forwardRef(() => UserService))
		private readonly usersService: UserService,
		private readonly hashingProvider: HashingProvider,
		private readonly jwtService: JwtService,
		@Inject(jwtConfig.KEY)
		private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
	) {}

	public async signIn(signInDto: SignInDto) {
		let user = await this.usersService.findOneByEmail(signInDto.email);
		let isEqual: boolean = false;

		try {
			isEqual = await this.hashingProvider.comparePassword(signInDto.password, user.password);
		} catch (err) {
			throw new RequestTimeoutException(err, {
				description: "could not compare passwords",
			});
		}

		if (!isEqual) throw new UnauthorizedException("incorrect password");

		const accessToken = await this.jwtService.signAsync(
			{
				sub: user.id,
				email: user.email,
			},
			{
				audience: this.jwtConfiguration.audience,
				issuer: this.jwtConfiguration.issuer,
				secret: this.jwtConfiguration.secret,
				expiresIn: this.jwtConfiguration.accessTokenTtl,
			},
		);

		return {
			accessToken,
		};
	}
}
