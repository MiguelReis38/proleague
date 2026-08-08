import { PrismaService } from '../prisma/prisma.service';
import { CreateChampionshipDto } from './dto/create-championship.dto';
export declare class ChampionshipsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(userId: string, data: CreateChampionshipDto): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        description: string | null;
        logoUrl: string | null;
        rules: string | null;
        winPoints: number;
        drawPoints: number;
        goalPoints: number;
        participationPoints: number;
        yellowCardPoints: number;
        redCardPoints: number;
        playersPerTeam: number;
        catAEnabled: boolean;
        catBEnabled: boolean;
        catCEnabled: boolean;
        goalkeeperEnabled: boolean;
        losePoints: number;
        userId: string;
    }>;
    findAllByUser(userId: string): Promise<({
        players: {
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
        }[];
        rounds: ({
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
        } & {
            number: number;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            championshipId: string;
            closed: boolean;
        })[];
    } & {
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        description: string | null;
        logoUrl: string | null;
        rules: string | null;
        winPoints: number;
        drawPoints: number;
        goalPoints: number;
        participationPoints: number;
        yellowCardPoints: number;
        redCardPoints: number;
        playersPerTeam: number;
        catAEnabled: boolean;
        catBEnabled: boolean;
        catCEnabled: boolean;
        goalkeeperEnabled: boolean;
        losePoints: number;
        userId: string;
    })[]>;
    findOne(userId: string, id: string): Promise<{
        players: {
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
        }[];
        rounds: ({
            matches: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                status: string;
                roundId: string;
                homeTeamId: string;
                awayTeamId: string;
                homeScore: number;
                awayScore: number;
            }[];
        } & {
            number: number;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            championshipId: string;
            closed: boolean;
        })[];
    } & {
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        description: string | null;
        logoUrl: string | null;
        rules: string | null;
        winPoints: number;
        drawPoints: number;
        goalPoints: number;
        participationPoints: number;
        yellowCardPoints: number;
        redCardPoints: number;
        playersPerTeam: number;
        catAEnabled: boolean;
        catBEnabled: boolean;
        catCEnabled: boolean;
        goalkeeperEnabled: boolean;
        losePoints: number;
        userId: string;
    }>;
    remove(userId: string, id: string): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        description: string | null;
        logoUrl: string | null;
        rules: string | null;
        winPoints: number;
        drawPoints: number;
        goalPoints: number;
        participationPoints: number;
        yellowCardPoints: number;
        redCardPoints: number;
        playersPerTeam: number;
        catAEnabled: boolean;
        catBEnabled: boolean;
        catCEnabled: boolean;
        goalkeeperEnabled: boolean;
        losePoints: number;
        userId: string;
    }>;
    getLeaderboard(userId: string, id: string): Promise<{
        id: string;
        name: string;
        category: string;
        photoUrl: string | null;
        number: number | null;
        points: number;
        goals: number;
        ownGoals: number;
        assists: number;
        wins: number;
        draws: number;
        losses: number;
        matchesPlayed: number;
    }[]>;
    update(userId: string, id: string, data: any): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        description: string | null;
        logoUrl: string | null;
        rules: string | null;
        winPoints: number;
        drawPoints: number;
        goalPoints: number;
        participationPoints: number;
        yellowCardPoints: number;
        redCardPoints: number;
        playersPerTeam: number;
        catAEnabled: boolean;
        catBEnabled: boolean;
        catCEnabled: boolean;
        goalkeeperEnabled: boolean;
        losePoints: number;
        userId: string;
    }>;
    getScorers(userId: string, id: string): Promise<{
        playerId: string;
        name: string | undefined;
        photoUrl: string | null | undefined;
        number: number | null | undefined;
        goals: number;
    }[]>;
    getGoalkeepers(userId: string, id: string): Promise<{
        playerId: string;
        name: string | undefined;
        photoUrl: string | null | undefined;
        number: number | null | undefined;
        saves: number;
    }[]>;
    resetStats(userId: string, id: string): Promise<{
        message: string;
    }>;
}
