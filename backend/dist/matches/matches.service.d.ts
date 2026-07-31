import { PrismaService } from '../prisma/prisma.service';
import { UpdateMatchStatDto } from './dto/update-match-stat.dto';
export declare class MatchesService {
    private prisma;
    constructor(prisma: PrismaService);
    updateScore(matchId: string, homeScore: number, awayScore: number): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        homeTeamId: string;
        awayTeamId: string;
        homeScore: number;
        awayScore: number;
        roundId: string;
    }>;
    updateStatus(matchId: string, status: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        homeTeamId: string;
        awayTeamId: string;
        homeScore: number;
        awayScore: number;
        roundId: string;
    }>;
    upsertStat(matchId: string, data: UpdateMatchStatDto): Promise<{
        id: string;
        playerId: string;
        goals: number;
        assists: number;
        yellowCards: number;
        redCards: number;
        ownGoals: number;
        saves: number;
        matchId: string;
    }>;
}
