"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.appContainer = exports.app = exports.appBinding = void 0;
const app_1 = require("./app");
const logger_1 = require("./logger");
const errors_1 = require("./errors");
const inversify_1 = require("inversify");
const types_1 = require("./types");
const config_1 = require("./config");
const prisma_service_1 = require("./database/prisma.service");
const users_1 = require("./users");
exports.appBinding = new inversify_1.ContainerModule((bind) => {
    bind(types_1.TYPES.ILogger).to(logger_1.LoggerService).inSingletonScope();
    bind(types_1.TYPES.UserController).to(users_1.UserController).inSingletonScope();
    bind(types_1.TYPES.UserService).to(users_1.UserService).inSingletonScope();
    bind(types_1.TYPES.ExeptionFilter).to(errors_1.ExeptionFilter).inSingletonScope();
    bind(types_1.TYPES.ConfigService).to(config_1.ConfigService).inSingletonScope();
    bind(types_1.TYPES.PrismaService).to(prisma_service_1.PrismaService).inSingletonScope();
    bind(types_1.TYPES.UserRepository).to(users_1.UserRepository).inSingletonScope();
    bind(types_1.TYPES.Application).to(app_1.App).inSingletonScope();
});
function bootstrap() {
    const appContainer = new inversify_1.Container();
    appContainer.load(exports.appBinding);
    const app = appContainer.get(types_1.TYPES.Application);
    app.init();
    return {
        app,
        appContainer,
    };
}
_a = bootstrap(), exports.app = _a.app, exports.appContainer = _a.appContainer;
//# sourceMappingURL=main.js.map