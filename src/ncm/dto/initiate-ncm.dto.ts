import { IsString, IsNotEmpty, MaxLength } from 'class-validator';

/**
 * DTO for initiating a No Confidence Motion
 */
export class InitiateNcmDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(2000)
  reason: string;
}

