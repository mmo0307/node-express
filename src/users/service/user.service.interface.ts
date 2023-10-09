import { UserLoginDto, UserRegisterDto } from '../dto';
import { UserModel } from '@prisma/client';

interface IUserService {
	createUser: (dto: UserRegisterDto) => Promise<UserModel | null>;
	loginUser: (dto: UserLoginDto) => Promise<boolean>;
	getUserInfo: (email: string) => Promise<UserModel | null>;
}

export { IUserService };
