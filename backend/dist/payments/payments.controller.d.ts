import { PaymentsService } from './payments.service';
export declare class PaymentsController {
    private readonly paymentsService;
    constructor(paymentsService: PaymentsService);
    getSubscription(req: any): Promise<{
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
    createSubscribeSession(req: any, body: {
        planId: string;
    }): Promise<{
        url: any;
        sandboxUrl: any;
        preferenceId: any;
    }>;
    createCheckoutSession(req: any, body: {
        planId: string;
    }): Promise<{
        url: any;
        sandboxUrl: any;
        preferenceId: any;
    }>;
    handleWebhook(body: any, query: any): Promise<{
        received: boolean;
    }>;
}
