import { PrismaService } from '../prisma/prisma.service';
import { CreatePlayerDto } from './dto/create-player.dto';
export declare class PlayersService {
    private prisma;
    constructor(prisma: PrismaService);
    create(userId: string, championshipId: string, data: CreatePlayerDto): Promise<{
        number: number | null;
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        active: boolean;
        photoUrl: string | null;
        category: string;
        birthDate: Date;
        manualPoints: number;
        championshipId: string;
    }>;
    findAllByChampionship(userId: string, championshipId: string): Promise<{
        number: number | null;
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        active: boolean;
        photoUrl: string | null;
        category: string;
        birthDate: Date;
        manualPoints: number;
        championshipId: string;
    }[]>;
    remove(userId: string, championshipId: string, id: string): Promise<{
        number: number | null;
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        active: boolean;
        photoUrl: string | null;
        category: string;
        birthDate: Date;
        manualPoints: number;
        championshipId: string;
    }>;
    update(userId: string, championshipId: string, id: string, data: any): Promise<{
        number: number | null;
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        active: boolean;
        photoUrl: string | null;
        category: string;
        birthDate: Date;
        manualPoints: number;
        championshipId: string;
    }>;
    updateManualPoints(userId: string, championshipId: string, id: string, points: number): Promise<{
        number: number | null;
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        active: boolean;
        photoUrl: string | null;
        category: string;
        birthDate: Date;
        manualPoints: number;
        championshipId: string;
    }>;
}
