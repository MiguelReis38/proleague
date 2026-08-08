import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateMatchStatDto } from './dto/update-match-stat.dto';

@Injectable()
export class MatchesService {
  constructor(private prisma: PrismaService) {}

  async updateScore(matchId: string, homeScore: number, awayScore: number) {
    const match = await this.prisma.match.update({
      where: { id: matchId },
      data: { homeScore, awayScore, status: 'FINISHED' }
    });

    const matchDetails = await this.prisma.match.findUnique({
      where: { id: matchId },
      include: {
        homeTeam: { include: { players: true } },
        awayTeam: { include: { players: true } },
      }
    });

    if (matchDetails) {
      const playerIds = [
        ...(matchDetails.homeTeam?.players.map(p => p.playerId) || []),
        ...(matchDetails.awayTeam?.players.map(p => p.playerId) || []),
      ];

      for (const playerId of playerIds) {
        await this.prisma.matchStat.upsert({
          where: { matchId_playerId: { matchId: match.id, playerId } },
          create: { matchId: match.id, playerId, goals: 0, assists: 0, yellowCards: 0, redCards: 0, ownGoals: 0, saves: 0 },
          update: {},
        });
      }
    }

    return match;
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
