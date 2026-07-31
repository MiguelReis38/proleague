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
exports.PlayersController = void 0;
const common_1 = require("@nestjs/common");
const players_service_1 = require("./players.service");
const create_player_dto_1 = require("./dto/create-player.dto");
const passport_1 = require("@nestjs/passport");
let PlayersController = class PlayersController {
    playersService;
    constructor(playersService) {
        this.playersService = playersService;
    }
    create(req, championshipId, createPlayerDto) {
        return this.playersService.create(req.user.id, championshipId, createPlayerDto);
    }
    findAll(req, championshipId) {
        return this.playersService.findAllByChampionship(req.user.id, championshipId);
    }
    remove(req, championshipId, id) {
        return this.playersService.remove(req.user.id, championshipId, id);
    }
};
exports.PlayersController = PlayersController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('championshipId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, create_player_dto_1.CreatePlayerDto]),
    __metadata("design:returntype", void 0)
], PlayersController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('championshipId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], PlayersController.prototype, "findAll", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('championshipId')),
    __param(2, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", void 0)
], PlayersController.prototype, "remove", null);
exports.PlayersController = PlayersController = __decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Controller)('championships/:championshipId/players'),
    __metadata("design:paramtypes", [players_service_1.PlayersService])
], PlayersController);
//# sourceMappingURL=players.controller.js.map