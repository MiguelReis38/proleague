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
        roundId: string;
        homeTeamId: string;
        awayTeamId: string;
        homeScore: number;
        awayScore: number;
    }>;
    updateStatus(id: string, status: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        roundId: string;
        homeTeamId: string;
        awayTeamId: string;
        homeScore: number;
        awayScore: number;
    }>;
    upsertStat(id: string, updateMatchStatDto: UpdateMatchStatDto): Promise<{
        id: string;
        playerId: string;
        matchId: string;
        goals: number;
        assists: number;
        yellowCards: number;
        redCards: number;
        ownGoals: number;
        saves: number;
    }>;
    borrowPlayer(teamId: string, playerId: string): Promise<{
        id: string;
        teamId: string;
        playerId: string;
        isBorrowed: boolean;
    }>;
    updateTeamPhoto(teamId: string, photoUrl: string): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        photoUrl: string | null;
        roundId: string;
    }>;
}
