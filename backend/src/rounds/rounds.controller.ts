import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { RoundsService } from './rounds.service';
import { CreateRoundDto } from './dto/create-round.dto';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt'))
@Controller('championships/:championshipId/rounds')
export class RoundsController {
  constructor(private readonly roundsService: RoundsService) {}

  @Post()
  create(
    @Request() req,
    @Param('championshipId') championshipId: string,
    @Body() createRoundDto: CreateRoundDto
  ) {
    return this.roundsService.create(req.user.id, championshipId, createRoundDto);
  }

  @Get()
  findAll(@Request() req, @Param('championshipId') championshipId: string) {
    return this.roundsService.findAllByChampionship(req.user.id, championshipId);
  }
}
