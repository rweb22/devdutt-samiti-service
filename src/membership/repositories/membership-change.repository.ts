import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { MembershipChange, SamitiRole, MembershipAction } from '../../entities';

/**
 * Membership Change Repository
 * Handles audit trail for membership changes
 */
@Injectable()
export class MembershipChangeRepository extends Repository<MembershipChange> {
  constructor(private dataSource: DataSource) {
    super(MembershipChange, dataSource.createEntityManager());
  }

  /**
   * Record a membership change
   */
  async recordChange(data: {
    username: string;
    samitiId: string;
    fromRole: SamitiRole | null;
    toRole: SamitiRole | null;
    action: MembershipAction;
    changedBy: string;
    justification?: string;
  }): Promise<MembershipChange> {
    const change = this.create({
      username: data.username,
      samitiId: data.samitiId,
      fromRole: data.fromRole,
      toRole: data.toRole,
      action: data.action,
      changedByUsername: data.changedBy,
      justification: data.justification || null,
    });

    return this.save(change);
  }

  /**
   * Get change history for a user in a samiti
   */
  async getHistory(username: string, samitiId: string): Promise<MembershipChange[]> {
    return this.find({
      where: {
        username,
        samitiId,
      },
      order: { changedAt: 'DESC' },
    });
  }

  /**
   * Get all changes in a samiti
   */
  async getSamitiHistory(samitiId: string): Promise<MembershipChange[]> {
    return this.find({
      where: { samitiId },
      order: { changedAt: 'DESC' },
    });
  }

  /**
   * Get recent changes (last N)
   */
  async getRecentChanges(limit: number = 50): Promise<MembershipChange[]> {
    return this.find({
      order: { changedAt: 'DESC' },
      take: limit,
    });
  }
}

