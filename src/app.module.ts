import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { UsersModule } from "./users/users.module";
import { PostsModule } from "./posts/posts.module";
import { AuthModule } from "./auth/auth.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TagsModule } from "./tags/tags.module";
import { MetaOptionsModule } from "./meta-options/meta-options.module";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { PaginationModule } from "./common/pagination/pagination.module";
import appConfig from "./config/app.config";
import databaseConfig from "./config/database.config";
import jwtConfig from "./auth/config/jwt.config";
import { JwtModule } from "@nestjs/jwt";
import { APP_GUARD, APP_INTERCEPTOR } from "@nestjs/core";
import { AccessTokenGuard } from "./auth/guards/access-token/access-token.guard";
import { AuthenticationGuard } from "./auth/guards/authentication/authentication.guard";
import { DataResponseInterceptor } from "./common/interceptors/data-response/data-response.interceptor";

const ENV = process.env.NODE_ENV;

@Module({
	imports: [
		UsersModule,
		PostsModule,
		AuthModule,
		ConfigModule.forRoot({
			isGlobal: true,
			// envFilePath: [".env.development"],
			envFilePath: !ENV ? ".env" : `.env.${ENV}`,
			load: [appConfig, databaseConfig],
		}),
		TypeOrmModule.forRootAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: (configService: ConfigService) => ({
				type: "postgres",
				// entities: [User],
				autoLoadEntities: configService.get("database.autoloadEntities"), // automatically creates tables -> needs imports: [TypeOrmModule.forFeature([Tag])] in module
				synchronize: configService.get("database.synchronize"), // do not use true in prod
				port: +configService.get("database.port"),
				username: configService.get("database.user"),
				password: configService.get("database.password"),
				host: configService.get("database.host"),
				database: configService.get("database.name"),
			}),
		}),
		TagsModule,
		MetaOptionsModule,
		PaginationModule,
		ConfigModule.forFeature(jwtConfig),
		JwtModule.registerAsync(jwtConfig.asProvider()),
	],
	controllers: [AppController],
	providers: [
		AppService,
		// apply guard globally
		{
			provide: APP_GUARD,
			useClass: AuthenticationGuard,
		},
		AccessTokenGuard,
		// dataResponseInterceptor globally
		{
			provide: APP_INTERCEPTOR,
			useClass: DataResponseInterceptor,
		},
	],
})
export class AppModule {}
