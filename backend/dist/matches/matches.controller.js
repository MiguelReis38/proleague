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
exports.MatchesController = void 0;
const common_1 = require("@nestjs/common");
const matches_service_1 = require("./matches.service");
const update_match_stat_dto_1 = require("./dto/update-match-stat.dto");
const passport_1 = require("@nestjs/passport");
let MatchesController = class MatchesController {
    matchesService;
    constructor(matchesService) {
        this.matchesService = matchesService;
    }
    updateScore(id, homeScore, awayScore) {
        return this.matchesService.updateScore(id, homeScore, awayScore);
    }
    updateStatus(id, status) {
        return this.matchesService.updateStatus(id, status);
    }
    upsertStat(id, updateMatchStatDto) {
        return this.matchesService.upsertStat(id, updateMatchStatDto);
    }
    borrowPlayer(teamId, playerId) {
        return this.matchesService.borrowPlayer(teamId, playerId);
    }
    updateTeamPhoto(teamId, photoUrl) {
        return this.matchesService.updateTeamPhoto(teamId, photoUrl);
    }
};
exports.MatchesController = MatchesController;
__decorate([
    (0, common_1.Put)(':id/score'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('homeScore')),
    __param(2, (0, common_1.Body)('awayScore')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Number]),
    __metadata("design:returntype", void 0)
], MatchesController.prototype, "updateScore", null);
__decorate([
    (0, common_1.Put)(':id/status'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], MatchesController.prototype, "updateStatus", null);
__decorate([
    (0, common_1.Post)(':id/stats'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_match_stat_dto_1.UpdateMatchStatDto]),
    __metadata("design:returntype", void 0)
], MatchesController.prototype, "upsertStat", null);
__decorate([
    (0, common_1.Post)('borrow'),
    __param(0, (0, common_1.Body)('teamId')),
    __param(1, (0, common_1.Body)('playerId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], MatchesController.prototype, "borrowPlayer", null);
__decorate([
    (0, common_1.Put)('team/:teamId/photo'),
    __param(0, (0, common_1.Param)('teamId')),
    __param(1, (0, common_1.Body)('photoUrl')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], MatchesController.prototype, "updateTeamPhoto", null);
exports.MatchesController = MatchesController = __decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Controller)('matches'),
    __metadata("design:paramtypes", [matches_service_1.MatchesService])
], MatchesController);
//# sourceMappingURL=matches.controller.js.map