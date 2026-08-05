import { Controller, Get, Param, NotFoundException } from '@nestjs/common';
import { PublicService } from './public.service';

@Controller('public')
export class PublicController {
  constructor(private readonly publicService: PublicService) {}

  @Get('championship/:id')
  async getLeaderboard(@Param('id') id: string) {
    const data = await this.publicService.getPublicLeaderboard(id);
    if (!data) throw new NotFoundException('Campeonato não encontrado');
    return data;
  }

  @Get('championship/:id/scorers')
  async getScorers(@Param('id') id: string) {
    return this.publicService.getPublicScorers(id);
  }

  @Get('championship/:id/goalkeepers')
  async getGoalkeepers(@Param('id') id: string) {
    return this.publicService.getPublicGoalkeepers(id);
  }
}
