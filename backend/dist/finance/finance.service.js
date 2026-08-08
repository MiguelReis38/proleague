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
exports.FinanceService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let FinanceService = class FinanceService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getFees(userId, championshipId) {
        await this.assertOwner(userId, championshipId);
        const players = await this.prisma.player.findMany({
            where: { championshipId, active: true },
            select: { id: true, name: true, photoUrl: true, number: true },
            orderBy: { name: 'asc' },
        });
        const fees = await this.prisma.playerFee.findMany({
            where: { championshipId },
            orderBy: { dueDate: 'desc' },
        });
        const expenses = await this.prisma.expense.findMany({
            where: { championshipId },
            orderBy: { date: 'desc' },
        });
        const totalCollected = fees
            .filter((f) => f.paidAt)
            .reduce((sum, f) => sum + f.amount, 0);
        const totalPending = fees
            .filter((f) => !f.paidAt)
            .reduce((sum, f) => sum + f.amount, 0);
        const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
        return {
            summary: {
                totalCollected,
                totalPending,
                totalExpenses,
                balance: totalCollected - totalExpenses,
                paidCount: fees.filter((f) => f.paidAt).length,
                totalPlayers: players.length,
            },
            players,
            fees,
            expenses,
        };
    }
    async createFee(userId, championshipId, data) {
        await this.assertOwner(userId, championshipId);
        return this.prisma.playerFee.create({
            data: {
                championshipId,
                playerId: data.playerId,
                amount: data.amount,
                dueDate: new Date(data.dueDate),
                note: data.note,
            },
        });
    }
    async markFeePaid(userId, championshipId, feeId) {
        await this.assertOwner(userId, championshipId);
        return this.prisma.playerFee.update({
            where: { id: feeId },
            data: { paidAt: new Date() },
        });
    }
    async markFeeUnpaid(userId, championshipId, feeId) {
        await this.assertOwner(userId, championshipId);
        return this.prisma.playerFee.update({
            where: { id: feeId },
            data: { paidAt: null },
        });
    }
    async deleteFee(userId, championshipId, feeId) {
        await this.assertOwner(userId, championshipId);
        return this.prisma.playerFee.delete({ where: { id: feeId } });
    }
    async createBulkFees(userId, championshipId, data) {
        await this.assertOwner(userId, championshipId);
        const players = await this.prisma.player.findMany({
            where: { championshipId, active: true },
            select: { id: true },
        });
        return this.prisma.playerFee.createMany({
            data: players.map((p) => ({
                championshipId,
                playerId: p.id,
                amount: data.amount,
                dueDate: new Date(data.dueDate),
                note: data.note,
            })),
        });
    }
    async createExpense(userId, championshipId, data) {
        await this.assertOwner(userId, championshipId);
        return this.prisma.expense.create({
            data: {
                championshipId,
                description: data.description,
                amount: data.amount,
                date: new Date(data.date),
                category: data.category ?? 'OTHER',
            },
        });
    }
    async deleteExpense(userId, championshipId, expenseId) {
        await this.assertOwner(userId, championshipId);
        return this.prisma.expense.delete({ where: { id: expenseId } });
    }
    async assertOwner(userId, championshipId) {
        const champ = await this.prisma.championship.findFirst({
            where: { id: championshipId, userId },
        });
        if (!champ)
            throw new Error('Campeonato não encontrado');
        return champ;
    }
};
exports.FinanceService = FinanceService;
exports.FinanceService = FinanceService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], FinanceService);
//# sourceMappingURL=finance.service.js.map