import {
  Controller, Get, Post, Delete, Put, Body, Param, Request, UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FinanceService } from './finance.service';

@UseGuards(AuthGuard('jwt'))
@Controller('championships/:championshipId/finance')
export class FinanceController {
  constructor(private financeService: FinanceService) {}

  // GET /championships/:id/finance  — resumo + todos os dados financeiros
  @Get()
  getAll(@Request() req, @Param('championshipId') champId: string) {
    return this.financeService.getFees(req.user.id, champId);
  }

  // POST /championships/:id/finance/fees  — criar mensalidade individual
  @Post('fees')
  createFee(
    @Request() req,
    @Param('championshipId') champId: string,
    @Body() body: { playerId: string; amount: number; dueDate: string; note?: string },
  ) {
    return this.financeService.createFee(req.user.id, champId, body);
  }

  // POST /championships/:id/finance/fees/bulk  — mensalidade para todos
  @Post('fees/bulk')
  createBulkFees(
    @Request() req,
    @Param('championshipId') champId: string,
    @Body() body: { amount: number; dueDate: string; note?: string },
  ) {
    return this.financeService.createBulkFees(req.user.id, champId, body);
  }

  // PUT /championships/:id/finance/fees/:feeId/pay  — marcar como pago
  @Put('fees/:feeId/pay')
  markPaid(
    @Request() req,
    @Param('championshipId') champId: string,
    @Param('feeId') feeId: string,
  ) {
    return this.financeService.markFeePaid(req.user.id, champId, feeId);
  }

  // PUT /championships/:id/finance/fees/:feeId/unpay  — marcar como não pago
  @Put('fees/:feeId/unpay')
  markUnpaid(
    @Request() req,
    @Param('championshipId') champId: string,
    @Param('feeId') feeId: string,
  ) {
    return this.financeService.markFeeUnpaid(req.user.id, champId, feeId);
  }

  // DELETE /championships/:id/finance/fees/:feeId
  @Delete('fees/:feeId')
  deleteFee(
    @Request() req,
    @Param('championshipId') champId: string,
    @Param('feeId') feeId: string,
  ) {
    return this.financeService.deleteFee(req.user.id, champId, feeId);
  }

  // POST /championships/:id/finance/expenses
  @Post('expenses')
  createExpense(
    @Request() req,
    @Param('championshipId') champId: string,
    @Body() body: { description: string; amount: number; date: string; category?: string },
  ) {
    return this.financeService.createExpense(req.user.id, champId, body);
  }

  // DELETE /championships/:id/finance/expenses/:expenseId
  @Delete('expenses/:expenseId')
  deleteExpense(
    @Request() req,
    @Param('championshipId') champId: string,
    @Param('expenseId') expenseId: string,
  ) {
    return this.financeService.deleteExpense(req.user.id, champId, expenseId);
  }
}
