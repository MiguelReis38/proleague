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
exports.RoundsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let RoundsService = class RoundsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(userId, championshipId, data) {
        const championship = await this.prisma.championship.findFirst({
            where: { id: championshipId, userId },
            include: { rounds: true }
        });
        if (!championship) {
            throw new common_1.ForbiddenException('Championship not found');
        }
        const players = await this.prisma.player.findMany({
            where: {
                id: { in: data.playerIds },
                championshipId
            }
        });
        if (players.length !== data.playerIds.length) {
            throw new common_1.BadRequestException('Some players were not found in this championship');
        }
        const playersPerTeam = championship.playersPerTeam || 7;
        const numTeams = Math.floor(players.length / playersPerTeam);
        if (numTeams < 2) {
            throw new common_1.BadRequestException(`Not enough players to form at least 2 teams of ${playersPerTeam} players`);
        }
        const goalkeepers = this.shuffle(players.filter(p => p.category === 'GOALKEEPER'));
        const catA = this.shuffle(players.filter(p => p.category === 'CAT_A'));
        const catB = this.shuffle(players.filter(p => p.category === 'CAT_B'));
        const catC = this.shuffle(players.filter(p => p.category === 'CAT_C'));
        const teamsArray = Array.from({ length: numTeams }, (_, i) => ({
            name: `Time ${i + 1}`,
            players: []
        }));
        this.distribute(goalkeepers, teamsArray);
        this.distribute(catA, teamsArray);
        this.distribute(catB, teamsArray);
        this.distribute(catC, teamsArray);
        const roundNumber = championship.rounds.length + 1;
        return this.prisma.$transaction(async (tx) => {
            const round = await tx.round.create({
                data: {
                    number: roundNumber,
                    championshipId
                }
            });
            const createdTeams = [];
            for (const t of teamsArray) {
                const team = await tx.team.create({
                    data: {
                        name: t.name,
                        roundId: round.id,
                        players: {
                            create: t.players.map(p => ({ playerId: p.id }))
                        }
                    }
                });
                createdTeams.push(team);
            }
            for (let i = 0; i < createdTeams.length; i++) {
                for (let j = i + 1; j < createdTeams.length; j++) {
                    await tx.match.create({
                        data: {
                            roundId: round.id,
                            homeTeamId: createdTeams[i].id,
                            awayTeamId: createdTeams[j].id,
                            status: 'SCHEDULED'
                        }
                    });
                }
            }
            return round;
        });
    }
    shuffle(array) {
        let currentIndex = array.length, randomIndex;
        while (currentIndex !== 0) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;
            [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
        }
        return array;
    }
    distribute(players, teams) {
        let teamIndex = 0;
        for (const player of players) {
            teams[teamIndex].players.push(player);
            teamIndex = (teamIndex + 1) % teams.length;
        }
    }
    async findAllByChampionship(userId, championshipId) {
        return this.prisma.round.findMany({
            where: { championshipId, championship: { userId } },
            include: {
                teams: { include: { players: { include: { player: true } } } },
                matches: { include: { homeTeam: true, awayTeam: true } }
            },
            orderBy: { number: 'asc' }
        });
    }
};
exports.RoundsService = RoundsService;
exports.RoundsService = RoundsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], RoundsService);
//# sourceMappingURL=rounds.service.js.map