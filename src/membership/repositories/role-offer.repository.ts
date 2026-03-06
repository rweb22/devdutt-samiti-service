import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { SamitiRoleOffer, OfferStatus } from '../../entities';

/**
 * Role Offer Repository
 * Handles database operations for role offers
 */
@Injectable()
export class RoleOfferRepository extends Repository<SamitiRoleOffer> {
  constructor(private dataSource: DataSource) {
    super(SamitiRoleOffer, dataSource.createEntityManager());
  }

  /**
   * Find pending offer for a user in a samiti
   */
  async findPendingOffer(
    username: string,
    samitiId: string,
  ): Promise<SamitiRoleOffer | null> {
    return this.findOne({
      where: {
        offeredToUsername: username,
        samitiId,
        status: OfferStatus.PENDING,
      },
    });
  }

  /**
   * Find all pending offers for a user
   */
  async findPendingByUser(username: string): Promise<SamitiRoleOffer[]> {
    return this.find({
      where: {
        offeredToUsername: username,
        status: OfferStatus.PENDING,
      },
      order: { createdAt: 'DESC' },
    });
  }

  /**
   * Find all offers for a user (any status)
   */
  async findByUser(username: string): Promise<SamitiRoleOffer[]> {
    return this.find({
      where: {
        offeredToUsername: username,
      },
      order: { createdAt: 'DESC' },
    });
  }

  /**
   * Find offers created by a user
   */
  async findByOfferer(username: string): Promise<SamitiRoleOffer[]> {
    return this.find({
      where: {
        offeredByUsername: username,
      },
      order: { createdAt: 'DESC' },
    });
  }

  /**
   * Find offers for a samiti
   */
  async findBySamiti(samitiId: string): Promise<SamitiRoleOffer[]> {
    return this.find({
      where: { samitiId },
      order: { createdAt: 'DESC' },
    });
  }

  /**
   * Count pending offers for a user
   */
  async countPendingByUser(username: string): Promise<number> {
    return this.count({
      where: {
        offeredToUsername: username,
        status: OfferStatus.PENDING,
      },
    });
  }
}

