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
      doc.fontSize(9).fillColor('#6b7280').text('Gerado por ProLeague · Desenvolvido por Miguel Reis', 50, doc.page.height - 50, { align: 'center' });

      doc.end();
    });
  }

  async generateLeaderboardPDF(
    championshipId: string,
    leaderboard: any[],
    scorers: any[] = [],
    goalkeepers: any[] = [],
  ): Promise<Buffer> {
    const championship = await this.prisma.championship.findUnique({
      where: { id: championshipId },
    });
    if (!championship) throw new Error('Championship not found');

    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({ margin: 50 });
      const buffers: Buffer[] = [];
      doc.on('data', (b) => buffers.push(b));
      doc.on('end', () => resolve(Buffer.concat(buffers)));
      doc.on('error', reject);

      const green = '#10b981';
      const gray = '#6b7280';
      const dark = '#111827';

      // ─── 1. SEÇÃO: CLASSIFICAÇÃO GERAL ───────────────────────────────────────
      doc.fontSize(22).fillColor(green).text('ProLeague', { align: 'center' });
      doc.fontSize(16).fillColor(dark).text(`Classificação Oficial – ${championship.name}`, { align: 'center' });
      doc.fontSize(10).fillColor(gray).text(`Gerado em: ${new Date().toLocaleDateString('pt-BR')}`, { align: 'center' });
      doc.moveDown(1.5);

      doc.moveTo(50, doc.y).lineTo(560, doc.y).strokeColor(green).lineWidth(1.5).stroke();
      doc.moveDown(1);

      // Table Header
      const colPos = 40;
      const colName = 80;
      const colNum = 250;
      const colPts = 290;
      const colJ = 330;
      const colV = 365;
      const colE = 400;
      const colD = 435;
      const colGols = 475;

      doc.fontSize(9).fillColor(gray);
      doc.text('Pos', colPos, doc.y, { width: 30 });
      const headerY = doc.y - doc.currentLineHeight();
      doc.text('Jogador', colName, headerY, { width: 160 });
      doc.text('Nº', colNum, headerY, { width: 35 });
      doc.text('PTS', colPts, headerY, { width: 35 });
      doc.text('J', colJ, headerY, { width: 30 });
      doc.text('V', colV, headerY, { width: 30 });
      doc.text('E', colE, headerY, { width: 30 });
      doc.text('D', colD, headerY, { width: 30 });
      doc.text('Gols', colGols, headerY, { width: 40 });

      doc.moveDown(0.3);
      doc.moveTo(50, doc.y).lineTo(560, doc.y).strokeColor('#e5e7eb').lineWidth(0.5).stroke();
      doc.moveDown(0.5);

      // Rows
      leaderboard.forEach((p, idx) => {
        if (doc.y > 700) {
          doc.addPage();
          doc.moveDown();
        }

        const rowY = doc.y;
        const isTop3 = idx < 3;

        doc.fontSize(10)
          .fillColor(isTop3 ? green : gray)
          .text(`${idx + 1}º`, colPos, rowY, { width: 30 });

        doc.fillColor(dark)
          .text(p.name, colName, rowY, { width: 160 });

        doc.fillColor(gray)
          .text(p.number ? `#${p.number}` : '—', colNum, rowY, { width: 35 });

        doc.fillColor(isTop3 ? green : dark).font('Helvetica-Bold')
          .text(String(p.points), colPts, rowY, { width: 35 });

        doc.font('Helvetica').fillColor(dark);
        doc.text(String(p.matchesPlayed || 0), colJ, rowY, { width: 30 });
        doc.text(String(p.wins || 0), colV, rowY, { width: 30 });
        doc.text(String(p.draws || 0), colE, rowY, { width: 30 });
        doc.text(String(p.losses || 0), colD, rowY, { width: 30 });
        doc.text(String(p.goals || 0), colGols, rowY, { width: 40 });

        doc.moveDown(0.2);
        doc.moveTo(50, doc.y).lineTo(560, doc.y).strokeColor('#f3f4f6').lineWidth(0.3).stroke();
        doc.moveDown(0.4);
      });

      // ─── 2. SEÇÃO: TABELA DE ARTILHARIA ────────────────────────────────────
      if (scorers && scorers.length > 0) {
        if (doc.y > 550) doc.addPage();
        else doc.moveDown(2);

        doc.fontSize(14).fillColor(green).font('Helvetica-Bold').text('⚽ Artilharia da Competição');
        doc.moveDown(0.5);
        doc.moveTo(50, doc.y).lineTo(560, doc.y).strokeColor(green).lineWidth(1).stroke();
        doc.moveDown(0.5);

        doc.fontSize(9).fillColor(gray).font('Helvetica');
        doc.text('Pos', colPos, doc.y, { width: 30 });
        const scHeaderY = doc.y - doc.currentLineHeight();
        doc.text('Jogador', colName, scHeaderY, { width: 200 });
        doc.text('Nº', colNum, scHeaderY, { width: 50 });
        doc.text('Gols Marcados', colGols, scHeaderY, { width: 80 });

        doc.moveDown(0.3);
        doc.moveTo(50, doc.y).lineTo(560, doc.y).strokeColor('#e5e7eb').lineWidth(0.5).stroke();
        doc.moveDown(0.5);

        scorers.slice(0, 10).forEach((s, idx) => {
          if (doc.y > 720) doc.addPage();
          const rY = doc.y;
          doc.fontSize(9).fillColor(idx === 0 ? green : dark).font(idx === 0 ? 'Helvetica-Bold' : 'Helvetica');
          doc.text(`${idx + 1}º`, colPos, rY, { width: 30 });
          doc.text(s.name, colName, rY, { width: 200 });
          doc.fillColor(gray).text(s.number ? `#${s.number}` : '—', colNum, rY, { width: 50 });
          doc.fillColor(green).font('Helvetica-Bold').text(`${s.goals || 0} gols`, colGols, rY, { width: 80 });
          doc.moveDown(0.4);
        });
      }

      // ─── 3. SEÇÃO: LUVA DE OURO (GOLEIROS) ────────────────────────────────
      if (goalkeepers && goalkeepers.length > 0) {
        if (doc.y > 550) doc.addPage();
        else doc.moveDown(2);

        doc.fontSize(14).fillColor(green).font('Helvetica-Bold').text('🧤 Luva de Ouro (Melhores Goleiros)');
        doc.moveDown(0.5);
        doc.moveTo(50, doc.y).lineTo(560, doc.y).strokeColor(green).lineWidth(1).stroke();
        doc.moveDown(0.5);

        doc.fontSize(9).fillColor(gray).font('Helvetica');
        doc.text('Pos', colPos, doc.y, { width: 30 });
        const gkHeaderY = doc.y - doc.currentLineHeight();
        doc.text('Goleiro', colName, gkHeaderY, { width: 200 });
        doc.text('Nº', colNum, gkHeaderY, { width: 50 });
        doc.text('Defesas Computadas', colGols, gkHeaderY, { width: 100 });

        doc.moveDown(0.3);
        doc.moveTo(50, doc.y).lineTo(560, doc.y).strokeColor('#e5e7eb').lineWidth(0.5).stroke();
        doc.moveDown(0.5);

        goalkeepers.slice(0, 10).forEach((gk, idx) => {
          if (doc.y > 720) doc.addPage();
          const rY = doc.y;
          doc.fontSize(9).fillColor(idx === 0 ? green : dark).font(idx === 0 ? 'Helvetica-Bold' : 'Helvetica');
          doc.text(`${idx + 1}º`, colPos, rY, { width: 30 });
          doc.text(gk.name, colName, rY, { width: 200 });
          doc.fillColor(gray).text(gk.number ? `#${gk.number}` : '—', colNum, rY, { width: 50 });
          doc.fillColor(green).font('Helvetica-Bold').text(`${gk.saves || 0} defesas`, colGols, rY, { width: 100 });
          doc.moveDown(0.4);
        });
      }

      // Footer
      doc.fontSize(9).fillColor(gray)
        .text('Gerado por ProLeague · Desenvolvido por Miguel Reis', 50, doc.page.height - 40, { align: 'center' });

      doc.end();
    });
  }
}
