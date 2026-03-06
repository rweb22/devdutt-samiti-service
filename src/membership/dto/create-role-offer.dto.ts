import { IsString, IsNotEmpty, IsOptional, MaxLength, IsUUID } from 'class-validator';

/**
 * DTO for creating a role offer
 */
export class CreateRoleOfferDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  offeredToUsername: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  platformRole: string;

  @IsUUID()
  @IsOptional()
  samitiId?: string;

  @IsString()
  @IsOptional()
  @MaxLength(1000)
  justification?: string;
}

