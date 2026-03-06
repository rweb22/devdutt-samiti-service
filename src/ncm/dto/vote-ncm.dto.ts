import { IsEnum } from 'class-validator';
import { NcmVoteType } from '../../entities';

/**
 * DTO for voting on a No Confidence Motion
 */
export class VoteNcmDto {
  @IsEnum(NcmVoteType)
  voteType: NcmVoteType;
}

