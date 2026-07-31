export declare class PaymentsController {
    createCheckoutSession(body: {
        planId: string;
        userId: string;
    }): Promise<{
        url: string;
        message: string;
    }>;
}
