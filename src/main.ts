import { App } from './app';
import { LoggerService, ILogger } from './logger';
import { ExeptionFilter } from './errors';
import { Container, ContainerModule, interfaces } from 'inversify';
import { TYPES } from './types';
import { ConfigService, IConfigService } from './config';
import { PrismaService } from './database/prisma.service';
import {
	IUserController,
	IUserRepository,
	IUserService,
	UserController,
	UserRepository,
	UserService,
} from './users';

interface IBootstrap {
	app: App;
	appContainer: Container;
}

export const appBinding = new ContainerModule((bind: interfaces.Bind) => {
	bind<ILogger>(TYPES.ILogger).to(LoggerService).inSingletonScope();
	bind<IUserController>(TYPES.UserController).to(UserController).inSingletonScope();
	bind<IUserService>(TYPES.UserService).to(UserService).inSingletonScope();
	bind<ExeptionFilter>(TYPES.ExeptionFilter).to(ExeptionFilter).inSingletonScope();
	bind<IConfigService>(TYPES.ConfigService).to(ConfigService).inSingletonScope();
	bind<PrismaService>(TYPES.PrismaService).to(PrismaService).inSingletonScope();
	bind<IUserRepository>(TYPES.UserRepository).to(UserRepository).inSingletonScope();
	bind<App>(TYPES.Application).to(App).inSingletonScope();
});

function bootstrap(): IBootstrap {
	const appContainer = new Container();

	appContainer.load(appBinding);

	const app = appContainer.get<App>(TYPES.Application);

	app.init();

	return {
		app,
		appContainer,
	};
}

export const { app, appContainer } = bootstrap();
