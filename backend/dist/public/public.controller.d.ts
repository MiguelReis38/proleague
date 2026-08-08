import { PublicService } from './public.service';
export declare class PublicController {
    private readonly publicService;
    constructor(publicService: PublicService);
    getLeaderboard(id: string): Promise<{
        championship: {
            name: string;
            id: string;
            status: string;
            logoUrl: string | null;
            winPoints: number;
            drawPoints: number;
            goalPoints: number;
            participationPoints: number;
            yellowCardPoints: number;
            redCardPoints: number;
            playersPerTeam: number;
            losePoints: number;
        };
        leaderboard: {
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
        }[];
    }>;
    getScorers(id: string): Promise<{
        playerId: string;
        name: string | undefined;
        photoUrl: string | null | undefined;
        number: number | null | undefined;
        goals: number;
    }[]>;
    getGoalkeepers(id: string): Promise<{
        playerId: string;
        name: string | undefined;
        photoUrl: string | null | undefined;
        number: number | null | undefined;
        saves: number;
    }[]>;
}
