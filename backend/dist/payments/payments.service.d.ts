import { PrismaService } from '../prisma/prisma.service';
export declare class PaymentsService {
    private prisma;
    private readonly logger;
    private readonly mpAccessToken;
    constructor(prisma: PrismaService);
    getUserSubscription(userId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        planType: string;
        status: string;
        mercadoPagoId: string | null;
        currentPeriodEnd: Date | null;
        active: boolean;
        userId: string;
    }>;
    createCheckoutPreference(userId: string, planId: string): Promise<{
        url: any;
        sandboxUrl: any;
        preferenceId: any;
    }>;
    handleWebhook(body: any, query: any): Promise<{
        received: boolean;
    }>;
    activatePlanManual(userId: string, planType: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        planType: string;
        status: string;
        mercadoPagoId: string | null;
        currentPeriodEnd: Date | null;
        active: boolean;
        userId: string;
    }>;
}
