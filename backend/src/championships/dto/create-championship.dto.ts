import { IsString, IsOptional, IsInt, IsBoolean } from 'class-validator';

export class CreateChampionshipDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  logoUrl?: string;

  @IsOptional()
  @IsString()
  rules?: string;

  @IsOptional()
  @IsInt()
  winPoints?: number;

  @IsOptional()
  @IsInt()
  drawPoints?: number;

  @IsOptional()
  @IsInt()
  goalPoints?: number;

  @IsOptional()
  @IsInt()
  participationPoints?: number;

  @IsOptional()
  @IsInt()
  yellowCardPoints?: number;

  @IsOptional()
  @IsInt()
  redCardPoints?: number;

  @IsOptional()
  @IsInt()
  playersPerTeam?: number;

  @IsOptional()
  @IsBoolean()
  catAEnabled?: boolean;

  @IsOptional()
  @IsBoolean()
  catBEnabled?: boolean;

  @IsOptional()
  @IsBoolean()
  catCEnabled?: boolean;

  @IsOptional()
  @IsBoolean()
  goalkeeperEnabled?: boolean;
}
