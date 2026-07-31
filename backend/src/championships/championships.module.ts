import { Module } from '@nestjs/common';
import { ChampionshipsService } from './championships.service';
import { ChampionshipsController } from './championships.controller';

@Module({
  controllers: [ChampionshipsController],
  providers: [ChampionshipsService],
})
export class ChampionshipsModule {}
