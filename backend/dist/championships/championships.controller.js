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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChampionshipsController = void 0;
const common_1 = require("@nestjs/common");
const championships_service_1 = require("./championships.service");
const create_championship_dto_1 = require("./dto/create-championship.dto");
const passport_1 = require("@nestjs/passport");
let ChampionshipsController = class ChampionshipsController {
    championshipsService;
    constructor(championshipsService) {
        this.championshipsService = championshipsService;
    }
    create(req, createChampionshipDto) {
        return this.championshipsService.create(req.user.id, createChampionshipDto);
    }
    findAll(req) {
        return this.championshipsService.findAllByUser(req.user.id);
    }
    findOne(req, id) {
        return this.championshipsService.findOne(req.user.id, id);
    }
    update(req, id, body) {
        return this.championshipsService.update(req.user.id, id, body);
    }
    getLeaderboard(req, id) {
        return this.championshipsService.getLeaderboard(req.user.id, id);
    }
    getScorers(req, id) {
        return this.championshipsService.getScorers(req.user.id, id);
    }
    getGoalkeepers(req, id) {
        return this.championshipsService.getGoalkeepers(req.user.id, id);
    }
    resetStats(req, id) {
        return this.championshipsService.resetStats(req.user.id, id);
    }
    remove(req, id) {
        return this.championshipsService.remove(req.user.id, id);
    }
};
exports.ChampionshipsController = ChampionshipsController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_championship_dto_1.CreateChampionshipDto]),
    __metadata("design:returntype", void 0)
], ChampionshipsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ChampionshipsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], ChampionshipsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", void 0)
], ChampionshipsController.prototype, "update", null);
__decorate([
    (0, common_1.Get)(':id/leaderboard'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], ChampionshipsController.prototype, "getLeaderboard", null);
__decorate([
    (0, common_1.Get)(':id/scorers'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], ChampionshipsController.prototype, "getScorers", null);
__decorate([
    (0, common_1.Get)(':id/goalkeepers'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], ChampionshipsController.prototype, "getGoalkeepers", null);
__decorate([
    (0, common_1.Delete)(':id/stats'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], ChampionshipsController.prototype, "resetStats", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], ChampionshipsController.prototype, "remove", null);
exports.ChampionshipsController = ChampionshipsController = __decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Controller)('championships'),
    __metadata("design:paramtypes", [championships_service_1.ChampionshipsService])
], ChampionshipsController);
//# sourceMappingURL=championships.controller.js.map