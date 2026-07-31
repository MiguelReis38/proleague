import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
const PDFDocument = require('pdfkit');

@Injectable()
export class ReportsService {
  constructor(private prisma: PrismaService) {}

  async generateChampionshipReport(championshipId: string): Promise<Buffer> {
    const championship = await this.prisma.championship.findUnique({
      where: { id: championshipId },
      include: {
        players: true,
        rounds: { include: { matches: { include: { homeTeam: true, awayTeam: true } } } },
      },
    });

    if (!championship) throw new Error('Championship not found');

    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({ margin: 50 });
      const buffers: Buffer[] = [];
      doc.on('data', (buffer) => buffers.push(buffer));
      doc.on('end', () => resolve(Buffer.concat(buffers)));
      doc.on('error', reject);

      // Header
      doc.fontSize(24).fillColor('#10b981').text('ProLeague - Relatório Oficial', { align: 'center' });
      doc.moveDown();
      
      doc.fontSize(20).fillColor('#111827').text(championship.name, { align: 'center' });
      doc.moveDown(2);

      // Players
      doc.fontSize(16).text(`Total de Jogadores Inscritos: ${championship.players.length}`);
      doc.moveDown();
      
      const playersByCategory = championship.players.reduce((acc, p) => {
        acc[p.category] = (acc[p.category] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      doc.fontSize(12).text(`- Categoria A: ${playersByCategory['CAT_A'] || 0}`);
      doc.text(`- Categoria B: ${playersByCategory['CAT_B'] || 0}`);
      doc.text(`- Categoria C: ${playersByCategory['CAT_C'] || 0}`);
      doc.text(`- Goleiros: ${playersByCategory['GOALKEEPER'] || 0}`);
      doc.moveDown(2);

      // Matches summary
      const totalRounds = championship.rounds.length;
      const totalMatches = championship.rounds.reduce((acc, r) => acc + r.matches.length, 0);

      doc.fontSize(16).text('Estatísticas do Torneio');
      doc.moveDown();
      doc.fontSize(12).text(`Rodadas criadas: ${totalRounds}`);
      doc.text(`Total de Partidas (Draft): ${totalMatches}`);
      doc.moveDown(2);

      // Footer
      doc.fontSize(10).fillColor('#6b7280').text('Gerado por ProLeague.com', 50, doc.page.height - 50, { align: 'center' });

      doc.end();
    });
  }
}
