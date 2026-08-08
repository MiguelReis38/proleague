import { PrismaService } from '../prisma/prisma.service';
import { CreateRoundDto } from './dto/create-round.dto';
export declare class RoundsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(userId: string, championshipId: string, data: CreateRoundDto): Promise<{
        number: number;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        championshipId: string;
        closed: boolean;
    }>;
    private shuffle;
    private distribute;
    delete(userId: string, roundId: string): Promise<{
        number: number;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        championshipId: string;
        closed: boolean;
    }>;
    close(userId: string, roundId: string): Promise<{
        number: number;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        championshipId: string;
        closed: boolean;
    }>;
    reopen(userId: string, roundId: string): Promise<{
        number: number;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        championshipId: string;
        closed: boolean;
    }>;
    findAllByChampionship(userId: string, championshipId: string): Promise<({
        matches: ({
            homeTeam: {
                name: string;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                photoUrl: string | null;
                roundId: string;
            };
            awayTeam: {
                name: string;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                photoUrl: string | null;
                roundId: string;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: string;
            roundId: string;
            homeTeamId: string;
            awayTeamId: string;
            homeScore: number;
            awayScore: number;
        })[];
        teams: ({
            players: ({
                player: {
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
                };
            } & {
                id: string;
                teamId: string;
                playerId: string;
                isBorrowed: boolean;
            })[];
        } & {
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            photoUrl: string | null;
            roundId: string;
        })[];
    } & {
        number: number;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        championshipId: string;
        closed: boolean;
    })[]>;
}
