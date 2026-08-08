import { PrismaService } from '../prisma/prisma.service';
export declare class FinanceService {
    private prisma;
    constructor(prisma: PrismaService);
    getFees(userId: string, championshipId: string): Promise<{
        summary: {
            totalCollected: number;
            totalPending: number;
            totalExpenses: number;
            balance: number;
            paidCount: number;
            totalPlayers: number;
        };
        players: {
            number: number | null;
            name: string;
            id: string;
            photoUrl: string | null;
        }[];
        fees: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            championshipId: string;
            playerId: string;
            amount: number;
            dueDate: Date;
            paidAt: Date | null;
            note: string | null;
        }[];
        expenses: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            description: string;
            category: string;
            championshipId: string;
            amount: number;
            date: Date;
        }[];
    }>;
    createFee(userId: string, championshipId: string, data: {
        playerId: string;
        amount: number;
        dueDate: string;
        note?: string;
    }): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        championshipId: string;
        playerId: string;
        amount: number;
        dueDate: Date;
        paidAt: Date | null;
        note: string | null;
    }>;
    markFeePaid(userId: string, championshipId: string, feeId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        championshipId: string;
        playerId: string;
        amount: number;
        dueDate: Date;
        paidAt: Date | null;
        note: string | null;
    }>;
    markFeeUnpaid(userId: string, championshipId: string, feeId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        championshipId: string;
        playerId: string;
        amount: number;
        dueDate: Date;
        paidAt: Date | null;
        note: string | null;
    }>;
    deleteFee(userId: string, championshipId: string, feeId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        championshipId: string;
        playerId: string;
        amount: number;
        dueDate: Date;
        paidAt: Date | null;
        note: string | null;
    }>;
    createBulkFees(userId: string, championshipId: string, data: {
        amount: number;
        dueDate: string;
        note?: string;
    }): Promise<import(".prisma/client").Prisma.BatchPayload>;
    createExpense(userId: string, championshipId: string, data: {
        description: string;
        amount: number;
        date: string;
        category?: string;
    }): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string;
        category: string;
        championshipId: string;
        amount: number;
        date: Date;
    }>;
    deleteExpense(userId: string, championshipId: string, expenseId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string;
        category: string;
        championshipId: string;
        amount: number;
        date: Date;
    }>;
    private assertOwner;
}
