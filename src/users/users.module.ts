import { forwardRef, Module } from "@nestjs/common";
import { UsersController } from "./users.controller";
import { UserService } from "./providers/users.service";
import { AuthModule } from "src/auth/auth.module";

@Module({
	controllers: [UsersController],
	providers: [UserService],
	exports: [UserService],
	imports: [forwardRef(() => AuthModule)],
})
export class UsersModule {}
