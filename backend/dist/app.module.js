"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const prisma_module_1 = require("./prisma/prisma.module");
const auth_module_1 = require("./auth/auth.module");
const championships_module_1 = require("./championships/championships.module");
const players_module_1 = require("./players/players.module");
const rounds_module_1 = require("./rounds/rounds.module");
const matches_module_1 = require("./matches/matches.module");
const upload_module_1 = require("./upload/upload.module");
const reports_module_1 = require("./reports/reports.module");
const payments_module_1 = require("./payments/payments.module");
const public_module_1 = require("./public/public.module");
const finance_module_1 = require("./finance/finance.module");
const serve_static_1 = require("@nestjs/serve-static");
const path_1 = require("path");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            serve_static_1.ServeStaticModule.forRoot({
                rootPath: (0, path_1.join)(__dirname, '..', 'uploads'),
                serveRoot: '/uploads',
            }),
            prisma_module_1.PrismaModule,
            auth_module_1.AuthModule,
            championships_module_1.ChampionshipsModule,
            players_module_1.PlayersModule,
            rounds_module_1.RoundsModule,
            matches_module_1.MatchesModule,
            upload_module_1.UploadModule,
            reports_module_1.ReportsModule,
            payments_module_1.PaymentsModule,
            public_module_1.PublicModule,
            finance_module_1.FinanceModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map