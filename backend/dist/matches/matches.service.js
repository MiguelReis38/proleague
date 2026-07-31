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
Object.defineProperty(exports, "__esModule", { value: true });
exports.MatchesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let MatchesService = class MatchesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async updateScore(matchId, homeScore, awayScore) {
        return this.prisma.match.update({
            where: { id: matchId },
            data: { homeScore, awayScore }
        });
    }
    async updateStatus(matchId, status) {
        return this.prisma.match.update({
            where: { id: matchId },
            data: { status }
        });
    }
    async upsertStat(matchId, data) {
        const match = await this.prisma.match.findUnique({ where: { id: matchId } });
        if (!match)
            throw new common_1.NotFoundException('Match not found');
        return this.prisma.matchStat.upsert({
            where: {
                matchId_playerId: { matchId, playerId: data.playerId }
            },
            update: {
                goals: data.goals,
                assists: data.assists,
                yellowCards: data.yellowCards,
                redCards: data.redCards,
                ownGoals: data.ownGoals,
                saves: data.saves
            },
            create: {
                matchId,
                playerId: data.playerId,
                goals: data.goals,
                assists: data.assists,
                yellowCards: data.yellowCards,
                redCards: data.redCards,
                ownGoals: data.ownGoals,
                saves: data.saves
            }
        });
    }
};
exports.MatchesService = MatchesService;
exports.MatchesService = MatchesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], MatchesService);
//# sourceMappingURL=matches.service.js.map