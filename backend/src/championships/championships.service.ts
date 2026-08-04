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
}
