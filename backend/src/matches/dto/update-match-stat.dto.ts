import { IsInt, IsString, IsNotEmpty } from 'class-validator';

export class UpdateMatchStatDto {
  @IsNotEmpty()
  @IsString()
  playerId: string;

  @IsInt()
  goals: number;

  @IsInt()
  assists: number;

  @IsInt()
  yellowCards: number;

  @IsInt()
  redCards: number;

  @IsInt()
  ownGoals: number;

  @IsInt()
  saves: number;
}
