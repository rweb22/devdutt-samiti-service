import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { NcmStatus } from './ncm-status.enum';

/**
 * NCM Motion Entity
 * Represents a No Confidence Motion against a Sabhapati
 */
@Entity({ name: 'ncm_motions', schema: 'samiti' })
export class NcmMotion {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'samiti_id', type: 'uuid', nullable: false })
  samitiId: string;

  @Column({ name: 'target_sabhapati_username', type: 'varchar', length: 50, nullable: false })
  targetSabhapatiUsername: string;

  @Column({ name: 'initiated_by_username', type: 'varchar', length: 50, nullable: false })
  initiatedByUsername: string;

  @Column({ type: 'text', nullable: false })
  reason: string;

  @Column({ type: 'enum', enum: NcmStatus, default: NcmStatus.COLLECTING_SIGNATURES })
  status: NcmStatus;

  @Column({ name: 'signature_threshold', type: 'int', nullable: false })
  signatureThreshold: number;

  @Column({ name: 'signatures_count', type: 'int', default: 0 })
  signaturesCount: number;

  @Column({ name: 'voting_started_at', type: 'timestamp with time zone', nullable: true })
  votingStartedAt: Date | null;

  @Column({ name: 'voting_ended_at', type: 'timestamp with time zone', nullable: true })
  votingEndedAt: Date | null;

  @Column({ name: 'votes_for', type: 'int', default: 0 })
  votesFor: number;

  @Column({ name: 'votes_against', type: 'int', default: 0 })
  votesAgainst: number;

  @Column({ name: 'votes_abstain', type: 'int', default: 0 })
  votesAbstain: number;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp with time zone' })
  updatedAt: Date;

  /**
   * Check if signature threshold is met
   */
  isSignatureThresholdMet(): boolean {
    return this.signaturesCount >= this.signatureThreshold;
  }

  /**
   * Check if motion passed (simple majority of FOR votes)
   */
  isPassed(): boolean {
    const totalVotes = this.votesFor + this.votesAgainst;
    return totalVotes > 0 && this.votesFor > this.votesAgainst;
  }

  /**
   * Get total votes cast
   */
  getTotalVotes(): number {
    return this.votesFor + this.votesAgainst + this.votesAbstain;
  }
}

