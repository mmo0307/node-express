import { UserModel } from '@prisma/client';
import { UserEntity } from '../entity';

interface IUserRepository {
	create: (user: UserEntity) => Promise<UserModel>;
	findByEmail: (email: string) => Promise<UserModel | null>;
}

export { IUserRepository };
