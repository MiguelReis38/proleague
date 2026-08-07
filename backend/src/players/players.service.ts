import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePlayerDto } from './dto/create-player.dto';

@Injectable()
export class PlayersService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, championshipId: string, data: CreatePlayerDto) {
    const championship = await this.prisma.championship.findFirst({
      where: { id: championshipId, userId }
    });
    if (!championship) {
      throw new ForbiddenException('Championship not found or access denied');
    }

    // Verificar se o usuário está no plano FREE e atingiu o limite de 30 jogadores
    const sub = await this.prisma.subscription.findUnique({ where: { userId } });
    const userPlan = sub?.planType || 'FREE';

    if (userPlan === 'FREE') {
      const playerCount = await this.prisma.player.count({
        where: { championshipId }
      });
      if (playerCount >= 15) {
        throw new ForbiddenException(
          'O plano Gratuito possui limite de 15 jogadores por campeonato. Faça upgrade para o Pro para adicionar mais!'
        );
      }
    }

    return this.prisma.player.create({
      data: {
        ...data,
        birthDate: new Date(data.birthDate),
        championshipId
      }
    });
  }

  async findAllByChampionship(userId: string, championshipId: string) {
    const championship = await this.prisma.championship.findFirst({
      where: { id: championshipId, userId }
    });
    if (!championship) {
      throw new ForbiddenException('Access denied');
    }

    return this.prisma.player.findMany({
      where: { championshipId },
      orderBy: { name: 'asc' }
    });
  }

  async remove(userId: string, championshipId: string, id: string) {
    const player = await this.prisma.player.findFirst({
      where: { id, championshipId, championship: { userId } }
    });
    if (!player) {
      throw new NotFoundException('Player not found');
    }

    return this.prisma.player.delete({ where: { id } });
  }

  async update(userId: string, championshipId: string, id: string, data: any) {
    const player = await this.prisma.player.findFirst({
      where: { id, championshipId, championship: { userId } }
    });
    if (!player) {
      throw new NotFoundException('Player not found');
    }

    const { name, category, number, photoUrl } = data;

    return this.prisma.player.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(category !== undefined && { category }),
        ...(number !== undefined && { number: number ? Number(number) : null }),
        ...(photoUrl !== undefined && { photoUrl }),
      }
    });
  }

  async updateManualPoints(userId: string, championshipId: string, id: string, points: number) {
    const player = await this.prisma.player.findFirst({
      where: { id, championshipId, championship: { userId } }
    });
    if (!player) {
      throw new NotFoundException('Player not found');
    }

    return this.prisma.player.update({
      where: { id },
      data: { manualPoints: points }
    });
  }
}
