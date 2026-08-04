import { Injectable, ForbiddenException, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRoundDto } from './dto/create-round.dto';

@Injectable()
export class RoundsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, championshipId: string, data: CreateRoundDto) {
    const championship = await this.prisma.championship.findFirst({
      where: { id: championshipId, userId },
      include: { rounds: true }
    });
    
    if (!championship) {
      throw new ForbiddenException('Championship not found');
    }

    const players = await this.prisma.player.findMany({
      where: {
        id: { in: data.playerIds },
        championshipId
      }
    });

    if (players.length !== data.playerIds.length) {
      throw new BadRequestException('Some players were not found in this championship');
    }

    const playersPerTeam = championship.playersPerTeam || 7;
    const numTeams = Math.floor(players.length / playersPerTeam);

    if (numTeams < 2) {
      throw new BadRequestException(`Not enough players to form at least 2 teams of ${playersPerTeam} players`);
    }

    // Group players
    const goalkeepers = this.shuffle(players.filter(p => p.category === 'GOALKEEPER'));
    const catA = this.shuffle(players.filter(p => p.category === 'CAT_A'));
    const catB = this.shuffle(players.filter(p => p.category === 'CAT_B'));
    const catC = this.shuffle(players.filter(p => p.category === 'CAT_C'));

    const teamsArray: any[] = Array.from({ length: numTeams }, (_, i) => ({
      name: `Time ${i + 1}`,
      players: []
    }));

    // Distribute players
    this.distribute(goalkeepers, teamsArray);
    this.distribute(catA, teamsArray);
    this.distribute(catB, teamsArray);
    this.distribute(catC, teamsArray);

    // Save to DB
    const roundNumber = championship.rounds.length + 1;
    
    return this.prisma.$transaction(async (tx) => {
      const round = await tx.round.create({
        data: {
          number: roundNumber,
          championshipId
        }
      });

      const createdTeams: any[] = [];
      for (const t of teamsArray) {
        const team = await tx.team.create({
          data: {
            name: t.name,
            roundId: round.id,
            players: {
              create: t.players.map(p => ({ playerId: p.id }))
            }
          }
        });
        createdTeams.push(team);
      }

      // Generate Matches (Round Robin)
      for (let i = 0; i < createdTeams.length; i++) {
        for (let j = i + 1; j < createdTeams.length; j++) {
          await tx.match.create({
            data: {
              roundId: round.id,
              homeTeamId: createdTeams[i].id,
              awayTeamId: createdTeams[j].id,
              status: 'SCHEDULED'
            }
          });
        }
      }

      return round;
    });
  }

  private shuffle(array: any[]) {
    let currentIndex = array.length, randomIndex;
    while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
    return array;
  }

  private distribute(players: any[], teams: any[]) {
    let teamIndex = 0;
    for (const player of players) {
      teams[teamIndex].players.push(player);
      teamIndex = (teamIndex + 1) % teams.length;
    }
  }

  async delete(userId: string, roundId: string) {
    const round = await this.prisma.round.findFirst({
      where: { id: roundId, championship: { userId } }
    });
    if (!round) throw new NotFoundException('Round not found');
    return this.prisma.round.delete({ where: { id: roundId } });
  }

  async close(userId: string, roundId: string) {
    const round = await this.prisma.round.findFirst({
      where: { id: roundId, championship: { userId } }
    });
    if (!round) throw new NotFoundException('Round not found');
    return this.prisma.round.update({ where: { id: roundId }, data: { closed: true } });
  }

  async reopen(userId: string, roundId: string) {
    const round = await this.prisma.round.findFirst({
      where: { id: roundId, championship: { userId } }
    });
    if (!round) throw new NotFoundException('Round not found');
    return this.prisma.round.update({ where: { id: roundId }, data: { closed: false } });
  }

  async findAllByChampionship(userId: string, championshipId: string) {
    return this.prisma.round.findMany({
      where: { championshipId, championship: { userId } },
      include: {
        teams: { include: { players: { include: { player: true } } } },
        matches: { include: { homeTeam: true, awayTeam: true } }
      },
      orderBy: { number: 'asc' }
    });
  }
}
