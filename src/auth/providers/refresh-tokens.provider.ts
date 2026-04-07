import { forwardRef, Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { RefreshTokenDto } from "../dtos/refresh-token.dto";
import { JwtService } from "@nestjs/jwt";
import { type ConfigType } from "@nestjs/config";
import jwtConfig from "../config/jwt.config";
import { UserService } from "src/users/providers/users.service";
import { GenerateTokensProvider } from "./generate-tokens.provider";
import { ActiveUserData } from "../interfaces/active-user-data.interface";

@Injectable()
export class RefreshTokensProvider {
	constructor(
		@Inject(jwtConfig.KEY)
		private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
		private readonly jwtService: JwtService,
		@Inject(forwardRef(() => UserService))
		private readonly userService: UserService,
		private readonly generateTokensProvider: GenerateTokensProvider,
	) {}

	public async refreshTokens(refreshTokenDto: RefreshTokenDto) {
		try {
			const { sub } = await this.jwtService.verifyAsync<Pick<ActiveUserData, "sub">>(refreshTokenDto.refreshToken, this.jwtConfiguration);
			const user = await this.userService.findOneById(sub);

			return await this.generateTokensProvider.generateTokens(user);
		} catch (err) {
			throw new UnauthorizedException(err);
		}
	}
}
