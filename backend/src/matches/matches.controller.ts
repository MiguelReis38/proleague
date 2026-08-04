import { Controller, Post, Body, Param, Put, UseGuards } from '@nestjs/common';
import { MatchesService } from './matches.service';
import { UpdateMatchStatDto } from './dto/update-match-stat.dto';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt'))
@Controller('matches')
export class MatchesController {
  constructor(private readonly matchesService: MatchesService) {}

  @Put(':id/score')
  updateScore(
    @Param('id') id: string,
    @Body('homeScore') homeScore: number,
    @Body('awayScore') awayScore: number
  ) {
    return this.matchesService.updateScore(id, homeScore, awayScore);
  }

  @Put(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body('status') status: string
  ) {
    return this.matchesService.updateStatus(id, status);
  }

  @Post(':id/stats')
  upsertStat(
    @Param('id') id: string,
    @Body() updateMatchStatDto: UpdateMatchStatDto
  ) {
    return this.matchesService.upsertStat(id, updateMatchStatDto);
  }

  @Post('borrow')
  borrowPlayer(
    @Body('teamId') teamId: string,
    @Body('playerId') playerId: string
  ) {
    return this.matchesService.borrowPlayer(teamId, playerId);
  }
}
