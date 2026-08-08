import { RoundsService } from './rounds.service';
import { CreateRoundDto } from './dto/create-round.dto';
export declare class RoundsController {
    private readonly roundsService;
    constructor(roundsService: RoundsService);
    create(req: any, championshipId: string, createRoundDto: CreateRoundDto): Promise<{
        number: number;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        championshipId: string;
        closed: boolean;
    }>;
    findAll(req: any, championshipId: string): Promise<({
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
    deleteRound(req: any, roundId: string): Promise<{
        number: number;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        championshipId: string;
        closed: boolean;
    }>;
    closeRound(req: any, roundId: string): Promise<{
        number: number;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        championshipId: string;
        closed: boolean;
    }>;
    reopenRound(req: any, roundId: string): Promise<{
        number: number;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        championshipId: string;
        closed: boolean;
    }>;
}
