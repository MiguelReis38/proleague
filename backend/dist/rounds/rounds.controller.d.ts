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
