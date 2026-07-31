import { IsArray, ArrayMinSize, IsString } from 'class-validator';

export class CreateRoundDto {
  @IsArray()
  @ArrayMinSize(10)
  @IsString({ each: true })
  playerIds: string[];
}
