import { IsString, IsNotEmpty, IsEnum, IsOptional, MaxLength } from 'class-validator';
import { SamitiRole } from '../../entities';

/**
 * DTO for appointing a member to a samiti
 */
export class AppointMemberDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  username: string;

  @IsEnum(SamitiRole)
  role: SamitiRole;

  @IsString()
  @IsOptional()
  @MaxLength(1000)
  justification?: string;
}

