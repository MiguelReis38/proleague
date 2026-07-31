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
            homeTeamId: string;
            awayTeamId: string;
            homeScore: number;
            awayScore: number;
            roundId: string;
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
                    championshipId: string;
                };
            } & {
                id: string;
                playerId: string;
                teamId: string;
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
