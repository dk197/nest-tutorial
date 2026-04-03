import { ConflictException, Injectable, RequestTimeoutException } from "@nestjs/common";
import { CreateUserDto } from "../dtos/create-user.dto";
import { User } from "../user.entity";
import { DataSource } from "typeorm";
import { CreateManyUsersDto } from "../dtos/create-many-users.dto";

@Injectable()
export class UsersCreateManyProvider {
	constructor(private readonly dataSource: DataSource) {}

	public async createMany(createManyUsersDto: CreateManyUsersDto) {
		let newUsers: User[] = [];
		const queryRunner = this.dataSource.createQueryRunner();

		try {
			await queryRunner.connect();
			await queryRunner.startTransaction();
		} catch (err) {
			throw new RequestTimeoutException("could not connect to db");
		}

		try {
			for (const user of createManyUsersDto.users) {
				const newUser = queryRunner.manager.create(User, user);
				const result = await queryRunner.manager.save(newUser);
				newUsers.push(result);
			}
			await queryRunner.commitTransaction();
		} catch (err) {
			await queryRunner.rollbackTransaction();
			throw new ConflictException("could not complete transaction", {
				description: String(err),
			});
		} finally {
			await queryRunner.release();
		}
		return newUsers;
	}
}
