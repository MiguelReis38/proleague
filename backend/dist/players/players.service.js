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
exports.PlayersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let PlayersService = class PlayersService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(userId, championshipId, data) {
        const championship = await this.prisma.championship.findFirst({
            where: { id: championshipId, userId }
        });
        if (!championship) {
            throw new common_1.ForbiddenException('Championship not found or access denied');
        }
        const sub = await this.prisma.subscription.findUnique({ where: { userId } });
        const userPlan = sub?.planType || 'FREE';
        if (userPlan === 'FREE') {
            const playerCount = await this.prisma.player.count({
                where: { championshipId }
            });
            if (playerCount >= 15) {
                throw new common_1.ForbiddenException('O plano Gratuito possui limite de 15 jogadores por campeonato. Faça upgrade para o Pro para adicionar mais!');
            }
        }
        return this.prisma.player.create({
            data: {
                ...data,
                birthDate: new Date(data.birthDate),
                championshipId
            }
        });
    }
    async findAllByChampionship(userId, championshipId) {
        const championship = await this.prisma.championship.findFirst({
            where: { id: championshipId, userId }
        });
        if (!championship) {
            throw new common_1.ForbiddenException('Access denied');
        }
        return this.prisma.player.findMany({
            where: { championshipId },
            orderBy: { name: 'asc' }
        });
    }
    async remove(userId, championshipId, id) {
        const player = await this.prisma.player.findFirst({
            where: { id, championshipId, championship: { userId } }
        });
        if (!player) {
            throw new common_1.NotFoundException('Player not found');
        }
        return this.prisma.player.delete({ where: { id } });
    }
    async update(userId, championshipId, id, data) {
        const player = await this.prisma.player.findFirst({
            where: { id, championshipId, championship: { userId } }
        });
        if (!player) {
            throw new common_1.NotFoundException('Player not found');
        }
        const { name, category, number, photoUrl, birthDate } = data;
        return this.prisma.player.update({
            where: { id },
            data: {
                ...(name !== undefined && { name }),
                ...(category !== undefined && { category }),
                ...(number !== undefined && { number: number ? Number(number) : null }),
                ...(photoUrl !== undefined && { photoUrl }),
                ...(birthDate !== undefined && { birthDate: birthDate ? new Date(birthDate) : undefined }),
            }
        });
    }
    async updateManualPoints(userId, championshipId, id, points) {
        const player = await this.prisma.player.findFirst({
            where: { id, championshipId, championship: { userId } }
        });
        if (!player) {
            throw new common_1.NotFoundException('Player not found');
        }
        return this.prisma.player.update({
            where: { id },
            data: { manualPoints: points }
        });
    }
};
exports.PlayersService = PlayersService;
exports.PlayersService = PlayersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PlayersService);
//# sourceMappingURL=players.service.js.map