import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateChampionshipDto } from './dto/create-championship.dto';

@Injectable()
export class ChampionshipsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, data: CreateChampionshipDto) {
    const champ = await this.prisma.championship.create({
      data: {
        ...data,
        userId,
      },
    });

    // Gerar 20 jogadores de exemplo (mock)
    const samplePlayers = Array.from({ length: 20 }).map((_, index) => {
      const categories = ['CAT_A', 'CAT_B', 'CAT_C', 'GOALKEEPER'];
      const randomCategory = categories[Math.floor(Math.random() * categories.length)];
      
      // Data de nascimento genérica (Idade entre 20 e 35 anos)
      const mockBirthDate = new Date();
      mockBirthDate.setFullYear(mockBirthDate.getFullYear() - (20 + Math.floor(Math.random() * 15)));

      return {
        name: `Jogador Teste ${index + 1}`,
        category: randomCategory,
        birthDate: mockBirthDate,
        number: index + 1,
        championshipId: champ.id
      };
    });

    await this.prisma.player.createMany({
      data: samplePlayers
    });

    return champ;
  }

  async findAllByUser(userId: string) {
    return this.prisma.championship.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        players: true,
        rounds: { include: { matches: { include: { homeTeam: true, awayTeam: true } } } }
      }
    });
  }

  async findOne(userId: string, id: string) {
    const championship = await this.prisma.championship.findFirst({
      where: { id, userId },
      include: {
        players: true,
        rounds: { include: { matches: true } }
      }
    });

    if (!championship) {
      throw new NotFoundException('Championship not found');
    }

    return championship;
  }

  async remove(userId: string, id: string) {
    const championship = await this.findOne(userId, id);
    return this.prisma.championship.delete({
      where: { id: championship.id },
    });
  }

  async getLeaderboard(userId: string, id: string) {
    const championship = await this.findOne(userId, id);
    
    // Buscar todos os jogadores do campeonato
    const players = await this.prisma.player.findMany({
      where: { championshipId: id }
    });

    // Buscar todos os TeamPlayers (para saber quem é emprestado em qual time)
    const teamPlayers = await this.prisma.teamPlayer.findMany({
      where: { team: { round: { championshipId: id } } }
    });

    // Mapear teamPlayers por time e jogador para acesso rápido
    const teamPlayerMap = new Map<string, boolean>();
    teamPlayers.forEach(tp => {
      teamPlayerMap.set(`${tp.teamId}-${tp.playerId}`, tp.isBorrowed);
    });

    // Buscar todas as estatísticas de partidas concluídas
    const matchStats = await this.prisma.matchStat.findMany({
      where: { match: { round: { championshipId: id }, status: 'FINISHED' } },
      include: {
        match: true
      }
    });

    const leaderboard = players.map(p => ({
      id: p.id,
      name: p.name,
      category: p.category,
      photoUrl: p.photoUrl,
      number: p.number,
      points: p.manualPoints, // Inicia com os pontos manuais
      goals: 0,
      assists: 0,
      wins: 0,
      draws: 0,
      losses: 0,
      matchesPlayed: 0
    }));

    const playerStatsMap = new Map(leaderboard.map(p => [p.id, p]));

    for (const stat of matchStats) {
      const p = playerStatsMap.get(stat.playerId);
      if (!p) continue;

      const match = stat.match;
      
      // Descobrir se o jogador jogou pelo time da casa ou visitante
      // Precisamos checar qual teamId ele tem nesta match
      const playedForHome = teamPlayerMap.has(`${match.homeTeamId}-${stat.playerId}`);
      const playedForAway = teamPlayerMap.has(`${match.awayTeamId}-${stat.playerId}`);
      
      let teamId = null;
      if (playedForHome) teamId = match.homeTeamId;
      else if (playedForAway) teamId = match.awayTeamId;
      
      if (!teamId) continue; // Por segurança, não deveria acontecer

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
      p.assists += stat.assists;

      if (won) p.wins++;
      else if (drew) p.draws++;
      else if (lost) p.losses++;

      if (isBorrowed) {
        // Regra Especial: Emprestado só ganha 1 ponto por vitória. Sem pontos por gol/empate/derrota/participação.
        if (won) p.points += 1;
      } else {
        // Regra Normal
        p.points += championship.participationPoints;
        p.points += stat.goals * championship.goalPoints;
        p.points += stat.yellowCards * championship.yellowCardPoints; // Geralmente negativo
        p.points += stat.redCards * championship.redCardPoints; // Geralmente negativo

        if (won) p.points += championship.winPoints;
        else if (drew) p.points += championship.drawPoints;
        else if (lost) p.points += championship.losePoints;
      }
    }

    // Ordenar por: Pontos (desc), Vitórias (desc), Gols (desc)
    return Array.from(playerStatsMap.values()).sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points;
      if (b.wins !== a.wins) return b.wins - a.wins;
      return b.goals - a.goals;
    });
  }
}
