import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateMatchStatDto } from './dto/update-match-stat.dto';

@Injectable()
export class MatchesService {
  constructor(private prisma: PrismaService) {}

  async updateScore(matchId: string, homeScore: number, awayScore: number) {
    return this.prisma.match.update({
      where: { id: matchId },
      data: { homeScore, awayScore }
    });
  }

  async updateStatus(matchId: string, status: string) {
    return this.prisma.match.update({
      where: { id: matchId },
      data: { status }
    });
  }

  async upsertStat(matchId: string, data: UpdateMatchStatDto) {
    const match = await this.prisma.match.findUnique({ where: { id: matchId } });
    if (!match) throw new NotFoundException('Match not found');

    return this.prisma.matchStat.upsert({
      where: {
        matchId_playerId: { matchId, playerId: data.playerId }
      },
      update: {
        goals: data.goals,
        assists: data.assists,
        yellowCards: data.yellowCards,
        redCards: data.redCards,
        ownGoals: data.ownGoals,
        saves: data.saves
      },
      create: {
        matchId,
        playerId: data.playerId,
        goals: data.goals,
        assists: data.assists,
        yellowCards: data.yellowCards,
        redCards: data.redCards,
        ownGoals: data.ownGoals,
        saves: data.saves
      }
    });
  }

  async borrowPlayer(teamId: string, playerId: string) {
    return this.prisma.teamPlayer.create({
      data: {
        teamId,
        playerId,
        isBorrowed: true
      }
    });
  }

  async updateTeamPhoto(teamId: string, photoUrl: string) {
    return this.prisma.team.update({
      where: { id: teamId },
      data: { photoUrl }
    });
  }
}
