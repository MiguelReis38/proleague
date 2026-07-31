import { PlayersService } from './players.service';
import { CreatePlayerDto } from './dto/create-player.dto';
export declare class PlayersController {
    private readonly playersService;
    constructor(playersService: PlayersService);
    create(req: any, championshipId: string, createPlayerDto: CreatePlayerDto): Promise<{
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
    }>;
    findAll(req: any, championshipId: string): Promise<{
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
    }[]>;
    remove(req: any, championshipId: string, id: string): Promise<{
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
    }>;
}
