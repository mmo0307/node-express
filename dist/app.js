"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.App = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const inversify_1 = require("inversify");
const types_1 = require("./types");
require("reflect-metadata");
const users_1 = require("./users");
const prisma_service_1 = require("./database/prisma.service");
const common_1 = require("./common");
let App = class App {
    constructor(logger, userController, exeptionFilter, configService, prismaService) {
        this.logger = logger;
        this.userController = userController;
        this.exeptionFilter = exeptionFilter;
        this.configService = configService;
        this.prismaService = prismaService;
        this.app = (0, express_1.default)();
        this.port = 8000;
        this.host = '127.0.0.1';
    }
    useMiddlewares() {
        this.app.use(express_1.default.json());
        this.app.use((0, cors_1.default)());
        const authMiddleware = new common_1.AuthMiddleware(this.configService.get('SECRET'));
        this.app.use(authMiddleware.execute.bind(authMiddleware));
    }
    useRoutes() {
        this.app.use('/users', this.userController.router);
    }
    useExeptionFilters() {
        this.app.use(this.exeptionFilter.catch.bind(this.exeptionFilter));
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            this.useMiddlewares();
            this.useRoutes();
            this.useExeptionFilters();
            yield this.prismaService.connect();
            this.server = this.app.listen(this.port, this.host);
            this.logger.log(`Server running at http://${this.host}:${this.port}`);
        });
    }
};
exports.App = App;
exports.App = App = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.ILogger)),
    __param(1, (0, inversify_1.inject)(types_1.TYPES.UserController)),
    __param(2, (0, inversify_1.inject)(types_1.TYPES.ExeptionFilter)),
    __param(3, (0, inversify_1.inject)(types_1.TYPES.ConfigService)),
    __param(4, (0, inversify_1.inject)(types_1.TYPES.PrismaService)),
    __metadata("design:paramtypes", [Object, users_1.UserController, Object, Object, prisma_service_1.PrismaService])
], App);
//# sourceMappingURL=app.js.map