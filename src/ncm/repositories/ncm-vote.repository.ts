import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { NcmVote } from '../../entities';

/**
 * NCM Vote Repository
 * Handles database operations for NCM votes
 */
@Injectable()
export class NcmVoteRepository extends Repository<NcmVote> {
  constructor(private dataSource: DataSource) {
    super(NcmVote, dataSource.createEntityManager());
  }

  /**
   * Check if user has voted on a motion
   */
  async hasVoted(motionId: string, username: string): Promise<boolean> {
    const count = await this.count({
      where: {
        ncmMotionId: motionId,
        username,
      },
    });
    return count > 0;
  }

  /**
   * Get all votes for a motion
   */
  async findByMotion(motionId: string): Promise<NcmVote[]> {
    return this.find({
      where: { ncmMotionId: motionId },
      order: { votedAt: 'ASC' },
    });
  }

  /**
   * Count votes for a motion
   */
  async countByMotion(motionId: string): Promise<number> {
    return this.count({
      where: { ncmMotionId: motionId },
    });
  }

  /**
   * Get votes by user
   */
  async findByUser(username: string): Promise<NcmVote[]> {
    return this.find({
      where: { username },
      order: { votedAt: 'DESC' },
    });
  }
}

