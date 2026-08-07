import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FinanceService {
  constructor(private prisma: PrismaService) {}

  // ─── MENSALIDADES ─────────────────────────────────────────────────────────

  async getFees(userId: string, championshipId: string) {
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

  async createFee(
    userId: string,
    championshipId: string,
    data: { playerId: string; amount: number; dueDate: string; note?: string },
  ) {
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

  async markFeePaid(userId: string, championshipId: string, feeId: string) {
    await this.assertOwner(userId, championshipId);
    return this.prisma.playerFee.update({
      where: { id: feeId },
      data: { paidAt: new Date() },
    });
  }

  async markFeeUnpaid(userId: string, championshipId: string, feeId: string) {
    await this.assertOwner(userId, championshipId);
    return this.prisma.playerFee.update({
      where: { id: feeId },
      data: { paidAt: null },
    });
  }

  async deleteFee(userId: string, championshipId: string, feeId: string) {
    await this.assertOwner(userId, championshipId);
    return this.prisma.playerFee.delete({ where: { id: feeId } });
  }

  // Cria mensalidade para TODOS os jogadores ativos de uma vez
  async createBulkFees(
    userId: string,
    championshipId: string,
    data: { amount: number; dueDate: string; note?: string },
  ) {
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

  // ─── DESPESAS ─────────────────────────────────────────────────────────────

  async createExpense(
    userId: string,
    championshipId: string,
    data: {
      description: string;
      amount: number;
      date: string;
      category?: string;
    },
  ) {
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

  async deleteExpense(
    userId: string,
    championshipId: string,
    expenseId: string,
  ) {
    await this.assertOwner(userId, championshipId);
    return this.prisma.expense.delete({ where: { id: expenseId } });
  }

  // ─── HELPER ───────────────────────────────────────────────────────────────

  private async assertOwner(userId: string, championshipId: string) {
    const champ = await this.prisma.championship.findFirst({
      where: { id: championshipId, userId },
    });
    if (!champ) throw new Error('Campeonato não encontrado');
    return champ;
  }
}
