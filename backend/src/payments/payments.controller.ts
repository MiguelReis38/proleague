import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';

@Controller('payments')
export class PaymentsController {
  
  @Post('checkout')
  async createCheckoutSession(@Body() body: { planId: string; userId: string }) {
    if (!body.userId) {
      throw new UnauthorizedException('Usuário não autenticado');
    }
    
    // Simula uma chamada ao Stripe/Mercado Pago que gera uma URL de checkout
    const mockCheckoutUrl = `http://localhost:3000/dashboard/billing/success?session_id=mock_session_${Date.now()}`;
    
    return {
      url: mockCheckoutUrl,
      message: 'Checkout gerado com sucesso (Mock)',
    };
  }
}
