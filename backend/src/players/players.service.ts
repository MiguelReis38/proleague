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
}
