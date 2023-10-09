import { NextFunction, Request, Response } from 'express';
import { HttpError } from '../../errors';
import { inject, injectable } from 'inversify';
import { TYPES } from '../../types';
import { ILogger } from '../../logger';
import { IUserController } from './user.controller.interface';
import 'reflect-metadata';
import { UserLoginDto, UserRegisterDto } from '../dto';
import { IUserService } from '../service';
import { ValidateMiddleware, BaseController, AuthGuard } from '../../common';
import { IConfigService } from '../../config';
import { sign } from 'jsonwebtoken';

@injectable()
class UserController extends BaseController implements IUserController {
	constructor(
		@inject(TYPES.ILogger) private loggerService: ILogger,
		@inject(TYPES.UserService) private userService: IUserService,
		@inject(TYPES.ConfigService) private configService: IConfigService,
	) {
		super(loggerService);

		this.bindRouters([
			{
				method: 'post',
				path: '/login',
				func: this.login,
				middlewares: [new ValidateMiddleware(UserLoginDto)],
			},
			{
				method: 'post',
				path: '/register',
				func: this.register,
				middlewares: [new ValidateMiddleware(UserRegisterDto)],
			},
			{
				path: '/info',
				method: 'get',
				func: this.info,
				middlewares: [new AuthGuard()],
			},
		]);
	}

	async login(
		{ body }: Request<{}, {}, UserLoginDto>,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		const user = await this.userService.loginUser(body);

		if (!user) {
			return next(new HttpError(401, 'Unauthorized', 'login'));
		}

		const jwt = await this.signJWT(body.email, this.configService.get('SECRET'));

		this.ok(res, { jwt });
	}

	async register(
		{ body }: Request<{}, {}, UserRegisterDto>,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		const newUser = await this.userService.createUser(body);

		if (!newUser) {
			return next(new HttpError(422, 'User is in the database'));
		}

		this.ok(res, {
			email: newUser.email,
			id: newUser.id,
		});
	}

	async info({ user }: Request, res: Response, next: NextFunction): Promise<void> {
		const userInfo = await this.userService.getUserInfo(user);
		this.ok(res, { email: userInfo?.email, id: userInfo?.id });
	}

	private signJWT(email: string, secret: string): Promise<string> {
		return new Promise<string>((resolve, reject) => {
			sign(
				{
					email,
					iat: Math.floor(Date.now() / 1000),
				},
				secret,
				{
					algorithm: 'HS256',
				},
				(err, token) => {
					if (err) {
						reject(err);
					}
					resolve(token as string);
				},
			);
		});
	}
}

export { UserController };
