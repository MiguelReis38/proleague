"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const PDFDocument = require('pdfkit');
let ReportsService = class ReportsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async generateChampionshipReport(championshipId) {
        const championship = await this.prisma.championship.findUnique({
            where: { id: championshipId },
            include: {
                players: true,
                rounds: { include: { matches: { include: { homeTeam: true, awayTeam: true } } } },
            },
        });
        if (!championship)
            throw new Error('Championship not found');
        return new Promise((resolve, reject) => {
            const doc = new PDFDocument({ margin: 50 });
            const buffers = [];
            doc.on('data', (buffer) => buffers.push(buffer));
            doc.on('end', () => resolve(Buffer.concat(buffers)));
            doc.on('error', reject);
            doc.fontSize(24).fillColor('#10b981').text('ProLeague - Relatório Oficial', { align: 'center' });
            doc.moveDown();
            doc.fontSize(20).fillColor('#111827').text(championship.name, { align: 'center' });
            doc.moveDown(2);
            doc.fontSize(16).text(`Total de Jogadores Inscritos: ${championship.players.length}`);
            doc.moveDown();
            const playersByCategory = championship.players.reduce((acc, p) => {
                acc[p.category] = (acc[p.category] || 0) + 1;
                return acc;
            }, {});
            doc.fontSize(12).text(`- Categoria A: ${playersByCategory['CAT_A'] || 0}`);
            doc.text(`- Categoria B: ${playersByCategory['CAT_B'] || 0}`);
            doc.text(`- Categoria C: ${playersByCategory['CAT_C'] || 0}`);
            doc.text(`- Goleiros: ${playersByCategory['GOALKEEPER'] || 0}`);
            doc.moveDown(2);
            const totalRounds = championship.rounds.length;
            const totalMatches = championship.rounds.reduce((acc, r) => acc + r.matches.length, 0);
            doc.fontSize(16).text('Estatísticas do Torneio');
            doc.moveDown();
            doc.fontSize(12).text(`Rodadas criadas: ${totalRounds}`);
            doc.text(`Total de Partidas (Draft): ${totalMatches}`);
            doc.moveDown(2);
            doc.fontSize(10).fillColor('#6b7280').text('Gerado por ProLeague.com', 50, doc.page.height - 50, { align: 'center' });
            doc.end();
        });
    }
};
exports.ReportsService = ReportsService;
exports.ReportsService = ReportsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ReportsService);
//# sourceMappingURL=reports.service.js.map