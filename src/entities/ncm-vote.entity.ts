import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';
import { NcmVoteType } from './ncm-vote-type.enum';

/**
 * NCM Vote Entity
 * Represents a member's vote on a No Confidence Motion
 */
@Entity({ name: 'ncm_votes', schema: 'samiti' })
export class NcmVote {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'ncm_motion_id', type: 'uuid', nullable: false })
  ncmMotionId: string;

  @Column({ type: 'varchar', length: 50, nullable: false })
  username: string;

  @Column({ name: 'vote_type', type: 'enum', enum: NcmVoteType, nullable: false })
  voteType: NcmVoteType;

  @CreateDateColumn({ name: 'voted_at', type: 'timestamp with time zone' })
  votedAt: Date;
}

