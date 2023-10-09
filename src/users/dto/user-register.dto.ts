import { IsEmail, IsString } from 'class-validator';

class UserRegisterDto {
	@IsEmail({}, { message: 'Email is not valid' })
	email: string;

	@IsString({ message: 'Password is not be empty' })
	password: string;

	@IsString({ message: 'Name is not be empty' })
	name: string;
}

export { UserRegisterDto };
