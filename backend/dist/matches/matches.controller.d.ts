import { MatchesService } from './matches.service';
import { UpdateMatchStatDto } from './dto/update-match-stat.dto';
export declare class MatchesController {
    private readonly matchesService;
    constructor(matchesService: MatchesService);
    updateScore(id: string, homeScore: number, awayScore: number): Promise<{
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
    updateStatus(id: string, status: string): Promise<{
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
    upsertStat(id: string, updateMatchStatDto: UpdateMatchStatDto): Promise<{
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
