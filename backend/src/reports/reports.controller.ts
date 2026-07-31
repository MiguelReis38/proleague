import { Controller, Get, Param, Res, NotFoundException } from '@nestjs/common';
import type { Response } from 'express';
import { ReportsService } from './reports.service';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('championship/:id')
  async getChampionshipReport(@Param('id') id: string, @Res() res: Response) {
    try {
      const pdfBuffer = await this.reportsService.generateChampionshipReport(id);
      
      res.set({
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename=relatorio-campeonato.pdf',
        'Content-Length': pdfBuffer.length,
      });
      
      res.end(pdfBuffer);
    } catch (error) {
      throw new NotFoundException('Erro ao gerar relatório do campeonato');
    }
  }
}
