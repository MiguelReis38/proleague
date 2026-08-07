import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);
  private readonly mpAccessToken =
    process.env.MERCADOPAGO_ACCESS_TOKEN ||
    'APP_USR-3487787699605119-080712-c0441e18c563e364893b448e1d96105a-3585165581';

  constructor(private prisma: PrismaService) {}

  async getUserSubscription(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });

    let sub = await this.prisma.subscription.findUnique({
      where: { userId },
    });

    // Se for a conta do Miguel (organizador principal), libera acesso PREMIUM vitalício gratuito!
    if (
      user &&
      (user.email.toLowerCase().includes('miguel') ||
        user.name.toLowerCase().includes('miguel'))
    ) {
      const farFuture = new Date();
      farFuture.setFullYear(farFuture.getFullYear() + 99);

      return this.prisma.subscription.upsert({
        where: { userId },
        create: {
          userId,
          planType: 'PREMIUM',
          status: 'ACTIVE',
          currentPeriodEnd: farFuture,
        },
        update: {
          planType: 'PREMIUM',
          status: 'ACTIVE',
          currentPeriodEnd: farFuture,
        },
      });
    }

    if (!sub) {
      sub = await this.prisma.subscription.create({
        data: {
          userId,
          planType: 'FREE',
          status: 'ACTIVE',
        },
      });
    }

    return sub;
  }

  async createCheckoutPreference(userId: string, planId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new Error('Usuário não encontrado');

    const planPrices: Record<string, { title: string; price: number }> = {
      PRO: {
        title: 'ProLeague — Plano Pro Mensal',
        price: 29.90,
      },
      PREMIUM: {
        title: 'ProLeague — Plano Premium Anual',
        price: 249.90,
      },
    };

    const selectedPlan = planPrices[planId.toUpperCase()];
    if (!selectedPlan) {
      throw new Error('Plano inválido');
    }

    const frontendUrl =
      process.env.FRONTEND_URL || 'https://proleague-kappa.vercel.app';
    const backendUrl =
      process.env.BACKEND_URL ||
      'https://proleague-backend-5i1x.onrender.com';

    const preferenceData = {
      items: [
        {
          id: planId.toUpperCase(),
          title: selectedPlan.title,
          quantity: 1,
          currency_id: 'BRL',
          unit_price: selectedPlan.price,
        },
      ],
      payer: {
        name: user.name,
        email: user.email,
      },
      back_urls: {
        success: `${frontendUrl}/dashboard/billing?status=success`,
        failure: `${frontendUrl}/dashboard/billing?status=failure`,
        pending: `${frontendUrl}/dashboard/billing?status=pending`,
      },
      auto_return: 'approved',
      external_reference: `${user.id}:${planId.toUpperCase()}`,
      notification_url: `${backendUrl}/payments/webhook`,
      payment_methods: {
        excluded_payment_methods: [],
        excluded_payment_types: [],
        installments: 12,
      },
    };

    try {
      const response = await fetch(
        'https://api.mercadopago.com/checkout/preferences',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${this.mpAccessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(preferenceData),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        this.logger.error('Erro no Mercado Pago:', data);
        throw new Error(
          data.message || 'Falha ao criar preferência de pagamento',
        );
      }

      return {
        url: data.init_point,
        sandboxUrl: data.sandbox_init_point,
        preferenceId: data.id,
      };
    } catch (err: any) {
      this.logger.error('Erro na integração do Mercado Pago', err);
      throw err;
    }
  }

  async handleWebhook(body: any, query: any) {
    this.logger.log('Webhook Mercado Pago recebido:', { body, query });

    const topic = query.topic || query.type || body.type;
    const paymentId = query['data.id'] || body?.data?.id || query.id;

    if (topic === 'payment' && paymentId) {
      try {
        const response = await fetch(
          `https://api.mercadopago.com/v1/payments/${paymentId}`,
          {
            headers: {
              Authorization: `Bearer ${this.mpAccessToken}`,
            },
          },
        );

        if (response.ok) {
          const payment = await response.json();
          this.logger.log('Detalhes do Pagamento:', payment);

          if (payment.status === 'approved') {
            const externalRef = payment.external_reference; // format: "userId:PLAN"
            if (externalRef && externalRef.includes(':')) {
              const [userId, planType] = externalRef.split(':');

              const periodDays = planType === 'PREMIUM' ? 365 : 30;
              const periodEnd = new Date();
              periodEnd.setDate(periodEnd.getDate() + periodDays);

              await this.prisma.subscription.upsert({
                where: { userId },
                create: {
                  userId,
                  planType,
                  status: 'ACTIVE',
                  mercadoPagoId: String(payment.id),
                  currentPeriodEnd: periodEnd,
                },
                update: {
                  planType,
                  status: 'ACTIVE',
                  mercadoPagoId: String(payment.id),
                  currentPeriodEnd: periodEnd,
                },
              });

              this.logger.log(
                `Assinatura do usuário ${userId} atualizada para ${planType}`,
              );
            }
          }
        }
      } catch (error) {
        this.logger.error('Erro ao processar webhook de pagamento', error);
      }
    }

    return { received: true };
  }

  async activatePlanManual(userId: string, planType: string) {
    const periodDays = planType === 'PREMIUM' ? 365 : 30;
    const periodEnd = new Date();
    periodEnd.setDate(periodEnd.getDate() + periodDays);

    return this.prisma.subscription.upsert({
      where: { userId },
      create: {
        userId,
        planType,
        status: 'ACTIVE',
        currentPeriodEnd: periodEnd,
      },
      update: {
        planType,
        status: 'ACTIVE',
        currentPeriodEnd: periodEnd,
      },
    });
  }
}
