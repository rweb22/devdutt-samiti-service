import { Injectable } from '@nestjs/common';
import { DataSource, Repository, IsNull } from 'typeorm';
import { Membership, SamitiRole } from '../../entities';

/**
 * Membership Repository
 * Handles database operations for Membership entities
 */
@Injectable()
export class MembershipRepository extends Repository<Membership> {
  constructor(private dataSource: DataSource) {
    super(Membership, dataSource.createEntityManager());
  }

  /**
   * Find active membership for a user in a samiti
   */
  async findActiveMembership(
    username: string,
    samitiId: string,
  ): Promise<Membership | null> {
    return this.findOne({
      where: {
        username,
        samitiId,
        endedAt: IsNull(),
      },
    });
  }

  /**
   * Find all active memberships for a user
   */
  async findActiveByUsername(username: string): Promise<Membership[]> {
    return this.find({
      where: {
        username,
        endedAt: IsNull(),
      },
      order: { joinedAt: 'DESC' },
    });
  }

  /**
   * Find all active memberships in a samiti
   */
  async findActiveBySamiti(samitiId: string): Promise<Membership[]> {
    return this.find({
      where: {
        samitiId,
        endedAt: IsNull(),
      },
      order: { joinedAt: 'ASC' },
    });
  }

  /**
   * Find active memberships by role in a samiti
   */
  async findActiveByRole(
    samitiId: string,
    role: SamitiRole,
  ): Promise<Membership[]> {
    return this.find({
      where: {
        samitiId,
        role,
        endedAt: IsNull(),
      },
      order: { joinedAt: 'ASC' },
    });
  }

  /**
   * Check if user has active membership in samiti
   */
  async hasActiveMembership(
    username: string,
    samitiId: string,
  ): Promise<boolean> {
    const count = await this.count({
      where: {
        username,
        samitiId,
        endedAt: IsNull(),
      },
    });
    return count > 0;
  }

  /**
   * Check if user has specific role in samiti
   */
  async hasRole(
    username: string,
    samitiId: string,
    role: SamitiRole,
  ): Promise<boolean> {
    const count = await this.count({
      where: {
        username,
        samitiId,
        role,
        endedAt: IsNull(),
      },
    });
    return count > 0;
  }

  /**
   * Get user's role in samiti (if active)
   */
  async getUserRole(
    username: string,
    samitiId: string,
  ): Promise<SamitiRole | null> {
    const membership = await this.findActiveMembership(username, samitiId);
    return membership ? membership.role : null;
  }

  /**
   * Count active members in samiti
   */
  async countActiveMembers(samitiId: string): Promise<number> {
    return this.count({
      where: {
        samitiId,
        endedAt: IsNull(),
      },
    });
  }

  /**
   * Count active members by role
   */
  async countActiveByRole(
    samitiId: string,
    role: SamitiRole,
  ): Promise<number> {
    return this.count({
      where: {
        samitiId,
        role,
        endedAt: IsNull(),
      },
    });
  }

  /**
   * End a membership (set endedAt to now)
   */
  async endMembership(membershipId: string): Promise<void> {
    await this.update(membershipId, { endedAt: new Date() });
  }

  /**
   * Find membership history for a user in a samiti
   */
  async findHistory(username: string, samitiId: string): Promise<Membership[]> {
    return this.find({
      where: {
        username,
        samitiId,
      },
      order: { joinedAt: 'DESC' },
    });
  }
}

