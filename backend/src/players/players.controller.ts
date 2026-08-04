import { Controller, Get, Post, Body, Param, Delete, UseGuards, Request, Put } from '@nestjs/common';
import { PlayersService } from './players.service';
import { CreatePlayerDto } from './dto/create-player.dto';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt'))
@Controller('championships/:championshipId/players')
export class PlayersController {
  constructor(private readonly playersService: PlayersService) {}

  @Post()
  create(
    @Request() req,
    @Param('championshipId') championshipId: string,
    @Body() createPlayerDto: CreatePlayerDto
  ) {
    return this.playersService.create(req.user.id, championshipId, createPlayerDto);
  }

  @Get()
  findAll(@Request() req, @Param('championshipId') championshipId: string) {
    return this.playersService.findAllByChampionship(req.user.id, championshipId);
  }

  @Delete(':id')
  remove(
    @Request() req,
    @Param('championshipId') championshipId: string,
    @Param('id') id: string
  ) {
    return this.playersService.remove(req.user.id, championshipId, id);
  }

  @Put(':id')
  update(
    @Request() req,
    @Param('championshipId') championshipId: string,
    @Param('id') id: string,
    @Body() updateData: any
  ) {
    return this.playersService.update(req.user.id, championshipId, id, updateData);
  }

  @Put(':id/manual-points')
  updateManualPoints(
    @Request() req,
    @Param('championshipId') championshipId: string,
    @Param('id') id: string,
    @Body('points') points: number
  ) {
    return this.playersService.updateManualPoints(req.user.id, championshipId, id, points);
  }
}
