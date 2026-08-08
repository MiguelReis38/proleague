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
exports.ChampionshipsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ChampionshipsService = class ChampionshipsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(userId, data) {
        const champ = await this.prisma.championship.create({
            data: {
                ...data,
                userId,
            },
        });
        const samplePlayers = Array.from({ length: 20 }).map((_, index) => {
            const categories = ['CAT_A', 'CAT_B', 'CAT_C', 'GOALKEEPER'];
            const randomCategory = categories[Math.floor(Math.random() * categories.length)];
            const mockBirthDate = new Date();
            mockBirthDate.setFullYear(mockBirthDate.getFullYear() - (20 + Math.floor(Math.random() * 15)));
            return {
                name: `Jogador Teste ${index + 1}`,
                category: randomCategory,
                birthDate: mockBirthDate,
                number: index + 1,
                championshipId: champ.id
            };
        });
        await this.prisma.player.createMany({
            data: samplePlayers
        });
        return champ;
    }
    async findAllByUser(userId) {
        return this.prisma.championship.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            include: {
                players: true,
                rounds: { include: { matches: { include: { homeTeam: true, awayTeam: true } } } }
            }
        });
    }
    async findOne(userId, id) {
        const championship = await this.prisma.championship.findFirst({
            where: { id, userId },
            include: {
                players: true,
                rounds: { include: { matches: true } }
            }
        });
        if (!championship) {
            throw new common_1.NotFoundException('Championship not found');
        }
        return championship;
    }
    async remove(userId, id) {
        const championship = await this.findOne(userId, id);
        return this.prisma.championship.delete({
            where: { id: championship.id },
        });
    }
    async getLeaderboard(userId, id) {
        const championship = await this.findOne(userId, id);
        const players = await this.prisma.player.findMany({
            where: { championshipId: id }
        });
        const teamPlayers = await this.prisma.teamPlayer.findMany({
            where: { team: { round: { championshipId: id } } }
        });
        const teamPlayerMap = new Map();
        teamPlayers.forEach(tp => {
            teamPlayerMap.set(`${tp.teamId}-${tp.playerId}`, tp.isBorrowed);
        });
        const matchStats = await this.prisma.matchStat.findMany({
            where: {
                match: {
                    round: { championshipId: id },
                    OR: [
                        { status: 'FINISHED' },
                        { round: { closed: true } }
                    ]
                }
            },
            include: {
                match: true
            }
        });
        const leaderboard = players.map(p => ({
            id: p.id,
            name: p.name,
            category: p.category,
            photoUrl: p.photoUrl,
            number: p.number,
            points: p.manualPoints,
            goals: 0,
            ownGoals: 0,
            assists: 0,
            wins: 0,
            draws: 0,
            losses: 0,
            matchesPlayed: 0
        }));
        const playerStatsMap = new Map(leaderboard.map(p => [p.id, p]));
        for (const stat of matchStats) {
            const p = playerStatsMap.get(stat.playerId);
            if (!p)
                continue;
            const match = stat.match;
            const playedForHome = teamPlayerMap.has(`${match.homeTeamId}-${stat.playerId}`);
            const playedForAway = teamPlayerMap.has(`${match.awayTeamId}-${stat.playerId}`);
            let teamId = null;
            if (playedForHome)
                teamId = match.homeTeamId;
            else if (playedForAway)
                teamId = match.awayTeamId;
            if (!teamId)
                continue;
            const isBorrowed = teamPlayerMap.get(`${teamId}-${stat.playerId}`) || false;
            let won = false;
            let drew = false;
            let lost = false;
            if (playedForHome) {
                if (match.homeScore > match.awayScore)
                    won = true;
                else if (match.homeScore === match.awayScore)
                    drew = true;
                else
                    lost = true;
            }
            else {
                if (match.awayScore > match.homeScore)
                    won = true;
                else if (match.awayScore === match.homeScore)
                    drew = true;
                else
                    lost = true;
            }
            p.matchesPlayed++;
            p.goals += stat.goals;
            p.ownGoals += stat.ownGoals;
            p.assists += stat.assists;
            if (won)
                p.wins++;
            else if (drew)
                p.draws++;
            else if (lost)
                p.losses++;
            if (isBorrowed) {
                if (won)
                    p.points += 1;
            }
            else {
                p.points += championship.participationPoints;
                p.points += stat.goals * championship.goalPoints;
                p.points += stat.yellowCards * championship.yellowCardPoints;
                p.points += stat.redCards * championship.redCardPoints;
                if (won)
                    p.points += championship.winPoints;
                else if (drew)
                    p.points += championship.drawPoints;
                else if (lost)
                    p.points += championship.losePoints;
            }
        }
        return Array.from(playerStatsMap.values()).sort((a, b) => {
            if (b.points !== a.points)
                return b.points - a.points;
            if (b.wins !== a.wins)
                return b.wins - a.wins;
            return b.goals - a.goals;
        });
    }
    async update(userId, id, data) {
        await this.findOne(userId, id);
        return this.prisma.championship.update({
            where: { id },
            data
        });
    }
    async getScorers(userId, id) {
        await this.findOne(userId, id);
        const stats = await this.prisma.matchStat.groupBy({
            by: ['playerId'],
            where: { match: { round: { championshipId: id } } },
            _sum: { goals: true }
        });
        const players = await this.prisma.player.findMany({ where: { championshipId: id } });
        const playerMap = new Map(players.map(p => [p.id, p]));
        return stats
            .filter(s => (s._sum.goals || 0) > 0)
            .map(s => ({
            playerId: s.playerId,
            name: playerMap.get(s.playerId)?.name,
            photoUrl: playerMap.get(s.playerId)?.photoUrl,
            number: playerMap.get(s.playerId)?.number,
            goals: s._sum.goals || 0
        }))
            .sort((a, b) => b.goals - a.goals);
    }
    async getGoalkeepers(userId, id) {
        await this.findOne(userId, id);
        const stats = await this.prisma.matchStat.groupBy({
            by: ['playerId'],
            where: { match: { round: { championshipId: id } } },
            _sum: { saves: true }
        });
        const players = await this.prisma.player.findMany({ where: { championshipId: id } });
        const playerMap = new Map(players.map(p => [p.id, p]));
        return stats
            .filter(s => (s._sum.saves || 0) > 0)
            .map(s => ({
            playerId: s.playerId,
            name: playerMap.get(s.playerId)?.name,
            photoUrl: playerMap.get(s.playerId)?.photoUrl,
            number: playerMap.get(s.playerId)?.number,
            saves: s._sum.saves || 0
        }))
            .sort((a, b) => b.saves - a.saves);
    }
    async resetStats(userId, id) {
        await this.findOne(userId, id);
        await this.prisma.matchStat.deleteMany({
            where: { match: { round: { championshipId: id } } }
        });
        await this.prisma.player.updateMany({
            where: { championshipId: id },
            data: { manualPoints: 0 }
        });
        return { message: 'Stats reset successfully' };
    }
};
exports.ChampionshipsService = ChampionshipsService;
exports.ChampionshipsService = ChampionshipsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ChampionshipsService);
//# sourceMappingURL=championships.service.js.map