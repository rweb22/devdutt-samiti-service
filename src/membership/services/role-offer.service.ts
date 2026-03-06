import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { RoleOfferRepository } from '../repositories/role-offer.repository';
import { SamitiRoleOffer, OfferStatus, SamitiRole } from '../../entities';
import { MembershipService } from './membership.service';

/**
 * Role Offer Service
 * Business logic for role offer workflow
 */
@Injectable()
export class RoleOfferService {
  constructor(
    private readonly roleOfferRepository: RoleOfferRepository,
    private readonly membershipService: MembershipService,
  ) {}

  /**
   * Create a role offer
   */
  async createOffer(
    offeredTo: string,
    platformRole: string,
    samitiId: string | null,
    offeredBy: string,
    justification?: string,
  ): Promise<SamitiRoleOffer> {
    // Check if user already has pending offer for this samiti
    if (samitiId) {
      const existing = await this.roleOfferRepository.findPendingOffer(
        offeredTo,
        samitiId,
      );
      if (existing) {
        throw new ConflictException(
          `User '${offeredTo}' already has a pending offer for this samiti`,
        );
      }
    }

    const offer = this.roleOfferRepository.create({
      offeredToUsername: offeredTo,
      platformRole,
      samitiId,
      offeredByUsername: offeredBy,
      justification: justification || null,
      status: OfferStatus.PENDING,
    });

    return this.roleOfferRepository.save(offer);
  }

  /**
   * Accept a role offer
   */
  async acceptOffer(offerId: string, username: string): Promise<void> {
    const offer = await this.roleOfferRepository.findOne({
      where: { id: offerId },
    });

    if (!offer) {
      throw new NotFoundException(`Offer with ID '${offerId}' not found`);
    }

    // Verify offer is for this user
    if (offer.offeredToUsername !== username) {
      throw new BadRequestException('This offer is not for you');
    }

    // Verify offer is pending
    if (offer.status !== OfferStatus.PENDING) {
      throw new BadRequestException(
        `Offer is ${offer.status}, cannot accept`,
      );
    }

    // Update offer status
    offer.status = OfferStatus.ACCEPTED;
    offer.respondedAt = new Date();
    await this.roleOfferRepository.save(offer);

    // Create membership if samiti-specific role
    if (offer.samitiId) {
      const role = this.mapPlatformRoleToSamitiRole(offer.platformRole);
      await this.membershipService.appointMember(
        offer.samitiId,
        username,
        role,
        offer.offeredByUsername,
        `Accepted role offer: ${offer.justification || 'No justification'}`,
      );
    }
  }

  /**
   * Reject a role offer
   */
  async rejectOffer(offerId: string, username: string): Promise<void> {
    const offer = await this.roleOfferRepository.findOne({
      where: { id: offerId },
    });

    if (!offer) {
      throw new NotFoundException(`Offer with ID '${offerId}' not found`);
    }

    // Verify offer is for this user
    if (offer.offeredToUsername !== username) {
      throw new BadRequestException('This offer is not for you');
    }

    // Verify offer is pending
    if (offer.status !== OfferStatus.PENDING) {
      throw new BadRequestException(
        `Offer is ${offer.status}, cannot reject`,
      );
    }

    // Update offer status
    offer.status = OfferStatus.REJECTED;
    offer.respondedAt = new Date();
    await this.roleOfferRepository.save(offer);
  }

  /**
   * Get pending offers for a user
   */
  async getPendingOffers(username: string): Promise<SamitiRoleOffer[]> {
    return this.roleOfferRepository.findPendingByUser(username);
  }

  /**
   * Get all offers for a user
   */
  async getUserOffers(username: string): Promise<SamitiRoleOffer[]> {
    return this.roleOfferRepository.findByUser(username);
  }

  /**
   * Map platform role to samiti role
   */
  private mapPlatformRoleToSamitiRole(platformRole: string): SamitiRole {
    switch (platformRole.toUpperCase()) {
      case 'SABHAPATI':
        return SamitiRole.SABHAPATI;
      case 'SADASYA':
        return SamitiRole.SADASYA;
      case 'OBSERVER':
        return SamitiRole.OBSERVER;
      default:
        throw new BadRequestException(`Unknown platform role: ${platformRole}`);
    }
  }
}

