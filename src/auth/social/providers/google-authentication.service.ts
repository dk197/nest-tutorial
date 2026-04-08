import { forwardRef, Inject, Injectable, OnModuleInit, UnauthorizedException } from "@nestjs/common";
import { type ConfigType } from "@nestjs/config";
import { OAuth2Client, TokenPayload } from "google-auth-library";
import jwtConfig from "src/auth/config/jwt.config";
import { GoogleTokenDto } from "../dtos/google-token.dto";
import { UserService } from "src/users/providers/users.service";
import { GenerateTokensProvider } from "src/auth/providers/generate-tokens.provider";

@Injectable()
export class GoogleAuthenticationService implements OnModuleInit {
	private oauthClient: OAuth2Client;

	constructor(
		@Inject(jwtConfig.KEY)
		private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
		@Inject(forwardRef(() => UserService))
		private readonly userService: UserService,
		private readonly generateTokensProvider: GenerateTokensProvider,
	) {}

	onModuleInit() {
		const clientId = this.jwtConfiguration.googleClientId;
		const clientSecret = this.jwtConfiguration.googleClientSecret;
		this.oauthClient = new OAuth2Client(clientId, clientSecret);
	}

	public async authenticate(googleTokenDto: GoogleTokenDto) {
		try {
			const loginTicket = await this.oauthClient.verifyIdToken({
				idToken: googleTokenDto.token,
			});
			const tokenPayload: TokenPayload | undefined = loginTicket.getPayload();
			if (!tokenPayload || !tokenPayload.email || !tokenPayload.given_name) throw new UnauthorizedException();
			const user = await this.userService.findOneByGoogleId(tokenPayload.sub);
			if (user) {
				return await this.generateTokensProvider.generateTokens(user);
			}

			const newUser = await this.userService.createGoogleUser({
				email: tokenPayload.email,
				firstName: tokenPayload.given_name,
				lastName: tokenPayload.family_name || "",
				googleId: tokenPayload.sub,
			});
			return await this.generateTokensProvider.generateTokens(newUser);
		} catch (err) {
			throw new UnauthorizedException();
		}
	}
}
