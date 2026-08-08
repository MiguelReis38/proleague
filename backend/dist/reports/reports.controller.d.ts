import type { Response } from 'express';
import { ReportsService } from './reports.service';
export declare class ReportsController {
    private readonly reportsService;
    constructor(reportsService: ReportsService);
    getChampionshipReport(id: string, res: Response): Promise<void>;
    getLeaderboardReport(id: string, leaderboard: any[], scorers: any[], goalkeepers: any[], res: Response): Promise<void>;
}
