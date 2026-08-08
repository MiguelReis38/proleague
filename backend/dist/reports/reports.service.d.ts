import { PrismaService } from '../prisma/prisma.service';
export declare class ReportsService {
    private prisma;
    constructor(prisma: PrismaService);
    generateChampionshipReport(championshipId: string): Promise<Buffer>;
    generateLeaderboardPDF(championshipId: string, leaderboard: any[], scorers?: any[], goalkeepers?: any[]): Promise<Buffer>;
}
