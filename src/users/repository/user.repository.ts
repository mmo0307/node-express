import { IUserRepository } from './user.repository.interface';
import { UserEntity } from '../entity';
import { UserModel } from '@prisma/client';
import { inject, injectable } from 'inversify';
import { TYPES } from '../../types';
import { ILogger } from '../../logger';
import { PrismaService } from '../../database/prisma.service';

@injectable()
class UserRepository implements IUserRepository {
	constructor(
		@inject(TYPES.ILogger) private logger: ILogger,
		@inject(TYPES.PrismaService) private prismaService: PrismaService,
	) {}

	async create({ name, password, email }: UserEntity): Promise<UserModel> {
		return this.prismaService.client.userModel.create({
			data: {
				email,
				password,
				name,
			},
		});
	}

	async findByEmail(email: string): Promise<UserModel | null> {
		return this.prismaService.client.userModel.findFirst({
			where: {
				email,
			},
		});
	}
}

export { UserRepository };
