import { IUserService } from './user.service.interface';
import { UserLoginDto, UserRegisterDto } from '../dto';
import { UserEntity } from '../entity';
import { inject, injectable } from 'inversify';
import { TYPES } from '../../types';
import { IConfigService } from '../../config';
import { IUserRepository } from '../repository';
import { UserModel } from '@prisma/client';

@injectable()
class UserService implements IUserService {
	constructor(
		@inject(TYPES.ConfigService) private configService: IConfigService,
		@inject(TYPES.UserRepository) private userRepository: IUserRepository,
	) {}

	async createUser({ name, email, password }: UserRegisterDto): Promise<UserModel | null> {
		const newUser = new UserEntity(email, name);

		const salt = this.configService.get('SALT');

		await newUser.setPassword(password, Number(salt));

		const existedUser = await this.userRepository.findByEmail(email);

		return existedUser ? null : this.userRepository.create(newUser);
	}

	async loginUser({ email, password }: UserLoginDto): Promise<boolean> {
		const existedUser = await this.userRepository.findByEmail(email);

		if (existedUser) {
			const user = new UserEntity(existedUser.email, existedUser.name, existedUser.password);

			return await user.comparePassword(password);
		}

		return false;
	}

	async getUserInfo(email: string): Promise<UserModel | null> {
		return this.userRepository.findByEmail(email);
	}
}

export { UserService };
