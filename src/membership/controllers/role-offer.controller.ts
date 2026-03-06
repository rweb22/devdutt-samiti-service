import {
  Controller,
  Get,
  Post,
  Param,
} from '@nestjs/common';
import { RoleOfferService } from '../services/role-offer.service';
import { SamitiRoleOffer } from '../../entities';

/**
 * Role Offer Controller
 * Endpoints for users to manage their role offers
 */
@Controller('api/v1/offers')
export class RoleOfferController {
  constructor(private readonly roleOfferService: RoleOfferService) {}

  /**
   * Get pending offers for current user
   * GET /api/v1/offers/pending
   */
  @Get('pending')
  async getPendingOffers(
    // TODO: Extract from JWT token
    // @CurrentUser() user: User,
  ): Promise<SamitiRoleOffer[]> {
    // TODO: Get username from authenticated user
    const username = 'current_user'; // Placeholder
    return this.roleOfferService.getPendingOffers(username);
  }

  /**
   * Get all offers for current user
   * GET /api/v1/offers
   */
  @Get()
  async getAllOffers(
    // TODO: Extract from JWT token
    // @CurrentUser() user: User,
  ): Promise<SamitiRoleOffer[]> {
    // TODO: Get username from authenticated user
    const username = 'current_user'; // Placeholder
    return this.roleOfferService.getUserOffers(username);
  }

  /**
   * Accept a role offer
   * POST /api/v1/offers/:id/accept
   */
  @Post(':id/accept')
  async acceptOffer(
    @Param('id') offerId: string,
    // TODO: Extract from JWT token
    // @CurrentUser() user: User,
  ): Promise<{ message: string }> {
    // TODO: Get username from authenticated user
    const username = 'current_user'; // Placeholder
    await this.roleOfferService.acceptOffer(offerId, username);
    return { message: 'Offer accepted successfully' };
  }

  /**
   * Reject a role offer
   * POST /api/v1/offers/:id/reject
   */
  @Post(':id/reject')
  async rejectOffer(
    @Param('id') offerId: string,
    // TODO: Extract from JWT token
    // @CurrentUser() user: User,
  ): Promise<{ message: string }> {
    // TODO: Get username from authenticated user
    const username = 'current_user'; // Placeholder
    await this.roleOfferService.rejectOffer(offerId, username);
    return { message: 'Offer rejected successfully' };
  }
}

