import express, { Express } from 'express';
import { Server } from 'http';
import cors from 'cors';
import { inject, injectable } from 'inversify';
import { TYPES } from './types';
import { ILogger } from './logger';
import 'reflect-metadata';
import { IExceptionFilter } from './errors';
import { IConfigService } from './config';
import { UserController } from './users';
import { PrismaService } from './database/prisma.service';
import { AuthMiddleware } from './common';

@injectable()
class App {
	app: Express;
	port: number;
	host: string;
	server: Server;

	constructor(
		@inject(TYPES.ILogger) private logger: ILogger,
		@inject(TYPES.UserController) private userController: UserController,
		@inject(TYPES.ExeptionFilter) private exeptionFilter: IExceptionFilter,
		@inject(TYPES.ConfigService) private configService: IConfigService,
		@inject(TYPES.PrismaService) private prismaService: PrismaService,
	) {
		this.app = express();
		this.port = 8000;
		this.host = '127.0.0.1';
	}

	useMiddlewares(): void {
		this.app.use(express.json());

		this.app.use(cors());

		const authMiddleware = new AuthMiddleware(this.configService.get('SECRET'));

		this.app.use(authMiddleware.execute.bind(authMiddleware));
	}

	useRoutes(): void {
		this.app.use('/users', this.userController.router);
	}

	useExeptionFilters(): void {
		this.app.use(this.exeptionFilter.catch.bind(this.exeptionFilter));
	}

	public async init(): Promise<void> {
		this.useMiddlewares();

		this.useRoutes();

		this.useExeptionFilters();

		await this.prismaService.connect();

		this.server = this.app.listen(this.port, this.host);

		this.logger.log(`Server running at http://${this.host}:${this.port}`);
	}
}

export { App };
