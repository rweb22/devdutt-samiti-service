import { IsString, IsOptional, Matches, MaxLength } from 'class-validator';

/**
 * DTO for updating a samiti
 */
export class UpdateSamitiDto {
  @IsString()
  @IsOptional()
  @Matches(/^[a-zA-Z0-9_]+$/, {
    message: 'Name must contain only alphanumeric characters and underscores',
  })
  @MaxLength(255)
  name?: string;

  @IsString()
  @IsOptional()
  @MaxLength(255)
  title?: string;
}

