import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { UsersModule } from "./users/users.module";
import { PostsModule } from "./posts/posts.module";
import { AuthModule } from "./auth/auth.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./users/user.entity";
import { TagsModule } from "./tags/tags.module";
import { MetaOptionsModule } from "./meta-options/meta-options.module";

@Module({
	imports: [
		UsersModule,
		PostsModule,
		AuthModule,
		TypeOrmModule.forRootAsync({
			imports: [],
			inject: [],
			useFactory: () => ({
				type: "postgres",
				// entities: [User],
				autoLoadEntities: true, // automatically creates tables -> needs imports: [TypeOrmModule.forFeature([Tag])] in module
				synchronize: true, // do not use in prod
				port: 5432,
				username: "postgres",
				password: "postgres",
				host: "localhost",
				database: "nestjs-blog",
			}),
		}),
		TagsModule,
		MetaOptionsModule,
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
