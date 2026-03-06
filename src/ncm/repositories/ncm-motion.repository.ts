import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { NcmMotion, NcmStatus } from '../../entities';

/**
 * NCM Motion Repository
 * Handles database operations for NCM motions
 */
@Injectable()
export class NcmMotionRepository extends Repository<NcmMotion> {
  constructor(private dataSource: DataSource) {
    super(NcmMotion, dataSource.createEntityManager());
  }

  /**
   * Find active motion for a samiti (COLLECTING_SIGNATURES or VOTING)
   */
  async findActiveMotion(samitiId: string): Promise<NcmMotion | null> {
    return this.createQueryBuilder('motion')
      .where('motion.samitiId = :samitiId', { samitiId })
      .andWhere('motion.status IN (:...statuses)', {
        statuses: [NcmStatus.COLLECTING_SIGNATURES, NcmStatus.VOTING],
      })
      .getOne();
  }

  /**
   * Find all motions for a samiti
   */
  async findBySamiti(samitiId: string): Promise<NcmMotion[]> {
    return this.find({
      where: { samitiId },
      order: { createdAt: 'DESC' },
    });
  }

  /**
   * Find motions by status
   */
  async findByStatus(status: NcmStatus): Promise<NcmMotion[]> {
    return this.find({
      where: { status },
      order: { createdAt: 'DESC' },
    });
  }

  /**
   * Find motions against a specific sabhapati
   */
  async findByTarget(username: string): Promise<NcmMotion[]> {
    return this.find({
      where: { targetSabhapatiUsername: username },
      order: { createdAt: 'DESC' },
    });
  }

  /**
   * Find motions initiated by a user
   */
  async findByInitiator(username: string): Promise<NcmMotion[]> {
    return this.find({
      where: { initiatedByUsername: username },
      order: { createdAt: 'DESC' },
    });
  }

  /**
   * Increment signature count
   */
  async incrementSignatureCount(motionId: string): Promise<void> {
    await this.increment({ id: motionId }, 'signaturesCount', 1);
  }

  /**
   * Increment vote count
   */
  async incrementVoteCount(
    motionId: string,
    voteType: 'FOR' | 'AGAINST' | 'ABSTAIN',
  ): Promise<void> {
    const field =
      voteType === 'FOR'
        ? 'votesFor'
        : voteType === 'AGAINST'
          ? 'votesAgainst'
          : 'votesAbstain';
    await this.increment({ id: motionId }, field, 1);
  }
}

