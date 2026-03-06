import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { NcmSignature } from '../../entities';

/**
 * NCM Signature Repository
 * Handles database operations for NCM signatures
 */
@Injectable()
export class NcmSignatureRepository extends Repository<NcmSignature> {
  constructor(private dataSource: DataSource) {
    super(NcmSignature, dataSource.createEntityManager());
  }

  /**
   * Check if user has signed a motion
   */
  async hasSigned(motionId: string, username: string): Promise<boolean> {
    const count = await this.count({
      where: {
        ncmMotionId: motionId,
        username,
      },
    });
    return count > 0;
  }

  /**
   * Get all signatures for a motion
   */
  async findByMotion(motionId: string): Promise<NcmSignature[]> {
    return this.find({
      where: { ncmMotionId: motionId },
      order: { signedAt: 'ASC' },
    });
  }

  /**
   * Count signatures for a motion
   */
  async countByMotion(motionId: string): Promise<number> {
    return this.count({
      where: { ncmMotionId: motionId },
    });
  }

  /**
   * Get signatures by user
   */
  async findByUser(username: string): Promise<NcmSignature[]> {
    return this.find({
      where: { username },
      order: { signedAt: 'DESC' },
    });
  }
}

