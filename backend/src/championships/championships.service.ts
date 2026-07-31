import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateChampionshipDto } from './dto/create-championship.dto';

@Injectable()
export class ChampionshipsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, data: CreateChampionshipDto) {
    return this.prisma.championship.create({
      data: {
        ...data,
        userId,
      },
    });
  }

  async findAllByUser(userId: string) {
    return this.prisma.championship.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
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
