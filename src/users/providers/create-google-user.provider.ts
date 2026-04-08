import { ConflictException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "../user.entity";
import { GoogleUser } from "../interfaces/google-user.interface";
import { Repository } from "typeorm";

@Injectable()
export class CreateGoogleUserProvider {
	constructor(
		@InjectRepository(User)
		private readonly userRepository: Repository<User>,
	) {}

	public async createGoogleUser(googleUser: GoogleUser) {
		try {
			const user = this.userRepository.create(googleUser);
			return await this.userRepository.save(user);
		} catch (err) {
			throw new ConflictException(err, {
				description: "could not create a new user",
			});
		}
	}
}
