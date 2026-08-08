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
exports.RoundsController = void 0;
const common_1 = require("@nestjs/common");
const rounds_service_1 = require("./rounds.service");
const create_round_dto_1 = require("./dto/create-round.dto");
const passport_1 = require("@nestjs/passport");
let RoundsController = class RoundsController {
    roundsService;
    constructor(roundsService) {
        this.roundsService = roundsService;
    }
    create(req, championshipId, createRoundDto) {
        return this.roundsService.create(req.user.id, championshipId, createRoundDto);
    }
    findAll(req, championshipId) {
        return this.roundsService.findAllByChampionship(req.user.id, championshipId);
    }
    deleteRound(req, roundId) {
        return this.roundsService.delete(req.user.id, roundId);
    }
    closeRound(req, roundId) {
        return this.roundsService.close(req.user.id, roundId);
    }
    reopenRound(req, roundId) {
        return this.roundsService.reopen(req.user.id, roundId);
    }
};
exports.RoundsController = RoundsController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('championshipId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, create_round_dto_1.CreateRoundDto]),
    __metadata("design:returntype", void 0)
], RoundsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('championshipId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], RoundsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Delete)(':roundId'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('roundId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], RoundsController.prototype, "deleteRound", null);
__decorate([
    (0, common_1.Put)(':roundId/close'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('roundId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], RoundsController.prototype, "closeRound", null);
__decorate([
    (0, common_1.Put)(':roundId/reopen'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('roundId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], RoundsController.prototype, "reopenRound", null);
exports.RoundsController = RoundsController = __decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Controller)('championships/:championshipId/rounds'),
    __metadata("design:paramtypes", [rounds_service_1.RoundsService])
], RoundsController);
//# sourceMappingURL=rounds.controller.js.map