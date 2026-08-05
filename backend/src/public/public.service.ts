import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PublicService {
  constructor(private prisma: PrismaService) {}

  async getPublicLeaderboard(championshipId: string) {
    const championship = await this.prisma.championship.findUnique({
      where: { id: championshipId },
      select: {
        id: true,
        name: true,
        logoUrl: true,
        status: true,
        playersPerTeam: true,
        winPoints: true,
        drawPoints: true,
        losePoints: true,
        goalPoints: true,
        participationPoints: true,
        yellowCardPoints: true,
        redCardPoints: true,
      }
    });

    if (!championship) return null;

    const players = await this.prisma.player.findMany({
      where: { championshipId },
    });

    const teamPlayers = await this.prisma.teamPlayer.findMany({
      where: { team: { round: { championshipId } } }
    });

    const teamPlayerMap = new Map<string, boolean>();
    teamPlayers.forEach(tp => {
      teamPlayerMap.set(`${tp.teamId}-${tp.playerId}`, tp.isBorrowed);
    });

    const matchStats = await this.prisma.matchStat.findMany({
      where: { match: { round: { championshipId }, status: 'FINISHED' } },
      include: { match: true }
    });

    const leaderboard = players.map(p => ({
      id: p.id,
      name: p.name,
      category: p.category,
      photoUrl: p.photoUrl,
      number: p.number,
      points: p.manualPoints,
      goals: 0,
      ownGoals: 0,
      assists: 0,
      wins: 0,
      draws: 0,
      losses: 0,
      matchesPlayed: 0,
    }));

    const playerStatsMap = new Map(leaderboard.map(p => [p.id, p]));

    for (const stat of matchStats) {
      const p = playerStatsMap.get(stat.playerId);
      if (!p) continue;

      const match = stat.match;
      const playedForHome = teamPlayerMap.has(`${match.homeTeamId}-${stat.playerId}`);
      const playedForAway = teamPlayerMap.has(`${match.awayTeamId}-${stat.playerId}`);

      let teamId: string | null = null;
      if (playedForHome) teamId = match.homeTeamId;
      else if (playedForAway) teamId = match.awayTeamId;
      if (!teamId) continue;

      const isBorrowed = teamPlayerMap.get(`${teamId}-${stat.playerId}`) || false;

      let won = false;
      let drew = false;
      let lost = false;

      if (playedForHome) {
        if (match.homeScore > match.awayScore) won = true;
        else if (match.homeScore === match.awayScore) drew = true;
        else lost = true;
      } else {
        if (match.awayScore > match.homeScore) won = true;
        else if (match.awayScore === match.homeScore) drew = true;
        else lost = true;
      }

      p.matchesPlayed++;
      p.goals += stat.goals;
      p.ownGoals += stat.ownGoals;
      p.assists += stat.assists;

      if (won) p.wins++;
      else if (drew) p.draws++;
      else if (lost) p.losses++;

      if (isBorrowed) {
        if (won) p.points += 1;
      } else {
        p.points += championship.participationPoints;
        p.points += stat.goals * championship.goalPoints;
        p.points += stat.yellowCards * championship.yellowCardPoints;
        p.points += stat.redCards * championship.redCardPoints;
        if (won) p.points += championship.winPoints;
        else if (drew) p.points += championship.drawPoints;
        else if (lost) p.points += championship.losePoints;
      }
    }

    const sorted = Array.from(playerStatsMap.values()).sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points;
      if (b.wins !== a.wins) return b.wins - a.wins;
      return b.goals - a.goals;
    });

    return {
      championship,
      leaderboard: sorted,
    };
  }

  async getPublicScorers(championshipId: string) {
    const stats = await this.prisma.matchStat.groupBy({
      by: ['playerId'],
      where: { match: { round: { championshipId }, status: 'FINISHED' } },
      _sum: { goals: true }
    });

    const players = await this.prisma.player.findMany({ where: { championshipId } });
    const playerMap = new Map(players.map(p => [p.id, p]));

    return stats
      .filter(s => (s._sum.goals || 0) > 0)
      .map(s => ({
        playerId: s.playerId,
        name: playerMap.get(s.playerId)?.name,
        photoUrl: playerMap.get(s.playerId)?.photoUrl,
        number: playerMap.get(s.playerId)?.number,
        goals: s._sum.goals || 0
      }))
      .sort((a, b) => b.goals - a.goals);
  }

  async getPublicGoalkeepers(championshipId: string) {
    const stats = await this.prisma.matchStat.groupBy({
      by: ['playerId'],
      where: { match: { round: { championshipId }, status: 'FINISHED' } },
      _sum: { saves: true }
    });

    const players = await this.prisma.player.findMany({ where: { championshipId } });
    const playerMap = new Map(players.map(p => [p.id, p]));

    return stats
      .filter(s => (s._sum.saves || 0) > 0)
      .map(s => ({
        playerId: s.playerId,
        name: playerMap.get(s.playerId)?.name,
        photoUrl: playerMap.get(s.playerId)?.photoUrl,
        number: playerMap.get(s.playerId)?.number,
        saves: s._sum.saves || 0
      }))
      .sort((a, b) => b.saves - a.saves);
  }
}
