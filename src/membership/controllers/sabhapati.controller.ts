import {
  Controller,
  Post,
  Delete,
  Body,
  Param,
  Get,
} from '@nestjs/common';
import { SamitiService } from '../../samiti/services/samiti.service';
import { MembershipService } from '../services/membership.service';
import { RoleOfferService } from '../services/role-offer.service';
import { CreateChildSamitiDto } from '../../samiti/dto';
import { AppointMemberDto, CreateRoleOfferDto } from '../dto';
import { Samiti, Membership, SamitiRoleOffer, SamitiRole } from '../../entities';

/**
 * Sabhapati Controller
 * Endpoints for Sabhapati (leader) operations
 * Requires SABHAPATI role
 */
@Controller('api/v1/sabhapati/samitis')
export class SabhapatiController {
  constructor(
    private readonly samitiService: SamitiService,
    private readonly membershipService: MembershipService,
    private readonly roleOfferService: RoleOfferService,
  ) {}

  /**
   * Create a child samiti
   * POST /api/v1/sabhapati/samitis/:id/children
   */
  @Post(':id/children')
  async createChild(
    @Param('id') parentId: string,
    @Body() dto: CreateChildSamitiDto,
    // TODO: Extract from JWT token
    // @CurrentUser() user: User,
  ): Promise<Samiti> {
    // TODO: Verify user is sabhapati of parent samiti
    const createdBy = 'sabhapati'; // Placeholder
    return this.samitiService.createChild(parentId, dto, createdBy);
  }

  /**
   * Appoint a member to the samiti
   * POST /api/v1/sabhapati/samitis/:id/members
   */
  @Post(':id/members')
  async appointMember(
    @Param('id') samitiId: string,
    @Body() dto: AppointMemberDto,
    // TODO: Extract from JWT token
    // @CurrentUser() user: User,
  ): Promise<Membership> {
    // TODO: Verify user is sabhapati of this samiti
    const appointedBy = 'sabhapati'; // Placeholder
    return this.membershipService.appointMember(
      samitiId,
      dto.username,
      dto.role,
      appointedBy,
      dto.justification,
    );
  }

  /**
   * Remove a member from the samiti
   * DELETE /api/v1/sabhapati/samitis/:id/members/:username
   */
  @Delete(':id/members/:username')
  async removeMember(
    @Param('id') samitiId: string,
    @Param('username') username: string,
    // TODO: Extract from JWT token
    // @CurrentUser() user: User,
  ): Promise<{ message: string }> {
    // TODO: Verify user is sabhapati of this samiti
    const removedBy = 'sabhapati'; // Placeholder
    await this.membershipService.removeMember(samitiId, username, removedBy);
    return { message: 'Member removed successfully' };
  }

  /**
   * Promote an observer to sadasya
   * POST /api/v1/sabhapati/samitis/:id/members/:username/promote
   */
  @Post(':id/members/:username/promote')
  async promoteMember(
    @Param('id') samitiId: string,
    @Param('username') username: string,
    // TODO: Extract from JWT token
    // @CurrentUser() user: User,
  ): Promise<Membership> {
    // TODO: Verify user is sabhapati of this samiti
    const promotedBy = 'sabhapati'; // Placeholder
    return this.membershipService.promoteMember(
      samitiId,
      username,
      SamitiRole.SADASYA,
      promotedBy,
      'Promoted from Observer to Sadasya',
    );
  }

  /**
   * Create a role offer (e.g., appoint child sabhapati)
   * POST /api/v1/sabhapati/samitis/:id/offers
   */
  @Post(':id/offers')
  async createRoleOffer(
    @Param('id') samitiId: string,
    @Body() dto: CreateRoleOfferDto,
    // TODO: Extract from JWT token
    // @CurrentUser() user: User,
  ): Promise<SamitiRoleOffer> {
    // TODO: Verify user is sabhapati of this samiti
    const offeredBy = 'sabhapati'; // Placeholder
    return this.roleOfferService.createOffer(
      dto.offeredToUsername,
      dto.platformRole,
      samitiId,
      offeredBy,
      dto.justification,
    );
  }

  /**
   * Get all members of the samiti
   * GET /api/v1/sabhapati/samitis/:id/members
   */
  @Get(':id/members')
  async getMembers(@Param('id') samitiId: string): Promise<Membership[]> {
    return this.membershipService.getActiveMembers(samitiId);
  }
}

