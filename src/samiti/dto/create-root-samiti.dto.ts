import { IsString, IsNotEmpty, IsOptional, Matches, MaxLength } from 'class-validator';

/**
 * DTO for creating a root samiti
 */
export class CreateRootSamitiDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^[a-zA-Z0-9_]+$/, {
    message: 'Name must contain only alphanumeric characters and underscores',
  })
  @MaxLength(255)
  name: string;

  @IsString()
  @IsOptional()
  @MaxLength(255)
  title?: string;
}

