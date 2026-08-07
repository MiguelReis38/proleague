import {
  Controller,
  Post,
  Get,
  Body,
  Query,
  Request,
  UseGuards,
  UnauthorizedException,
  HttpCode,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PaymentsService } from './payments.service';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get('subscription')
  async getSubscription(@Request() req) {
    return this.paymentsService.getUserSubscription(req.user.id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('subscribe')
  async createSubscribeSession(
    @Request() req,
    @Body() body: { planId: string },
  ) {
    if (!req.user || !req.user.id) {
      throw new UnauthorizedException('Usuário não autenticado');
    }
    return this.paymentsService.createCheckoutPreference(
      req.user.id,
      body.planId,
    );
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('checkout')
  async createCheckoutSession(
    @Request() req,
    @Body() body: { planId: string },
  ) {
    return this.paymentsService.createCheckoutPreference(
      req.user.id,
      body.planId,
    );
  }

  @Post('webhook')
  @HttpCode(200)
  async handleWebhook(@Body() body: any, @Query() query: any) {
    return this.paymentsService.handleWebhook(body, query);
  }
}
