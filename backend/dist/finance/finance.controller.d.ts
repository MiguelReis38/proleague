import { FinanceService } from './finance.service';
export declare class FinanceController {
    private financeService;
    constructor(financeService: FinanceService);
    getAll(req: any, champId: string): Promise<{
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
    createFee(req: any, champId: string, body: {
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
    createBulkFees(req: any, champId: string, body: {
        amount: number;
        dueDate: string;
        note?: string;
    }): Promise<import(".prisma/client").Prisma.BatchPayload>;
    markPaid(req: any, champId: string, feeId: string): Promise<{
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
    markUnpaid(req: any, champId: string, feeId: string): Promise<{
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
    deleteFee(req: any, champId: string, feeId: string): Promise<{
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
    createExpense(req: any, champId: string, body: {
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
    deleteExpense(req: any, champId: string, expenseId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string;
        category: string;
        championshipId: string;
        amount: number;
        date: Date;
    }>;
}
