import { Controller, Get, Post, Put, Body, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { ChampionshipsService } from './championships.service';
import { CreateChampionshipDto } from './dto/create-championship.dto';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt'))
@Controller('championships')
export class ChampionshipsController {
  constructor(private readonly championshipsService: ChampionshipsService) {}

  @Post()
  create(@Request() req, @Body() createChampionshipDto: CreateChampionshipDto) {
    return this.championshipsService.create(req.user.id, createChampionshipDto);
  }

  @Get()
  findAll(@Request() req) {
    return this.championshipsService.findAllByUser(req.user.id);
  }

  @Get(':id')
  findOne(@Request() req, @Param('id') id: string) {
    return this.championshipsService.findOne(req.user.id, id);
  }

  @Put(':id')
  update(@Request() req, @Param('id') id: string, @Body() body: any) {
    return this.championshipsService.update(req.user.id, id, body);
  }

  @Get(':id/leaderboard')
  getLeaderboard(@Request() req, @Param('id') id: string) {
    return this.championshipsService.getLeaderboard(req.user.id, id);
  }

  @Get(':id/scorers')
  getScorers(@Request() req, @Param('id') id: string) {
    return this.championshipsService.getScorers(req.user.id, id);
  }

  @Get(':id/goalkeepers')
  getGoalkeepers(@Request() req, @Param('id') id: string) {
    return this.championshipsService.getGoalkeepers(req.user.id, id);
  }

  @Delete(':id/stats')
  resetStats(@Request() req, @Param('id') id: string) {
    return this.championshipsService.resetStats(req.user.id, id);
  }

  @Delete(':id')
  remove(@Request() req, @Param('id') id: string) {
    return this.championshipsService.remove(req.user.id, id);
  }
}
