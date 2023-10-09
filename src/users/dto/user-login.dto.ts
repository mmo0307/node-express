import { IsEmail, IsString } from 'class-validator';

class UserLoginDto {
	@IsEmail({}, { message: 'Email is not valid' })
	email: string;

	@IsString({ message: 'Password is not be empty' })
	password: string;
}

export { UserLoginDto };
