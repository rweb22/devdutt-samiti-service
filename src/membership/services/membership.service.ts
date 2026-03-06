import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { MembershipRepository } from '../repositories/membership.repository';
import { Membership, SamitiRole, MembershipAction } from '../../entities';
import { SamitiRepository } from '../../samiti/repositories/samiti.repository';
import { MembershipChangeRepository } from '../repositories/membership-change.repository';

/**
 * Membership Service
 * Business logic for membership management
 */
@Injectable()
export class MembershipService {
  constructor(
    private readonly membershipRepository: MembershipRepository,
    private readonly samitiRepository: SamitiRepository,
    private readonly membershipChangeRepository: MembershipChangeRepository,
  ) {}

  /**
   * Appoint a user to a role in a samiti
   */
  async appointMember(
    samitiId: string,
    username: string,
    role: SamitiRole,
    appointedBy: string,
    justification?: string,
  ): Promise<Membership> {
    // Verify samiti exists
    const samiti = await this.samitiRepository.findOne({ where: { id: samitiId } });
    if (!samiti) {
      throw new NotFoundException(`Samiti with ID '${samitiId}' not found`);
    }

    // Check if user already has active membership
    const existing = await this.membershipRepository.findActiveMembership(
      username,
      samitiId,
    );
    if (existing) {
      throw new ConflictException(
        `User '${username}' already has active membership in this samiti`,
      );
    }

    // Create membership
    const membership = Membership.create(username, samitiId, role);
    const saved = await this.membershipRepository.save(membership);

    // Record change in audit trail
    await this.membershipChangeRepository.recordChange({
      username,
      samitiId,
      fromRole: null,
      toRole: role,
      action: MembershipAction.APPOINTED,
      changedBy: appointedBy,
      justification,
    });

    return saved;
  }

  /**
   * Promote a member to a higher role
   */
  async promoteMember(
    samitiId: string,
    username: string,
    newRole: SamitiRole,
    promotedBy: string,
    justification?: string,
  ): Promise<Membership> {
    // Get current membership
    const membership = await this.membershipRepository.findActiveMembership(
      username,
      samitiId,
    );
    if (!membership) {
      throw new NotFoundException(
        `User '${username}' does not have active membership in this samiti`,
      );
    }

    const oldRole = membership.role;

    // Validate promotion (OBSERVER -> SADASYA only)
    if (oldRole === SamitiRole.OBSERVER && newRole === SamitiRole.SADASYA) {
      // Valid promotion
    } else {
      throw new BadRequestException(
        `Invalid promotion from ${oldRole} to ${newRole}`,
      );
    }

    // Update role
    membership.role = newRole;
    const updated = await this.membershipRepository.save(membership);

    // Record change
    await this.membershipChangeRepository.recordChange({
      username,
      samitiId,
      fromRole: oldRole,
      toRole: newRole,
      action: MembershipAction.PROMOTED,
      changedBy: promotedBy,
      justification,
    });

    return updated;
  }

  /**
   * Remove a member from a samiti
   */
  async removeMember(
    samitiId: string,
    username: string,
    removedBy: string,
    justification?: string,
  ): Promise<void> {
    // Get current membership
    const membership = await this.membershipRepository.findActiveMembership(
      username,
      samitiId,
    );
    if (!membership) {
      throw new NotFoundException(
        `User '${username}' does not have active membership in this samiti`,
      );
    }

    const oldRole = membership.role;

    // End membership
    await this.membershipRepository.endMembership(membership.id);

    // Record change
    await this.membershipChangeRepository.recordChange({
      username,
      samitiId,
      fromRole: oldRole,
      toRole: null,
      action: MembershipAction.REMOVED,
      changedBy: removedBy,
      justification,
    });
  }

  /**
   * Get all active members of a samiti
   */
  async getActiveMembers(samitiId: string): Promise<Membership[]> {
    return this.membershipRepository.findActiveBySamiti(samitiId);
  }

  /**
   * Get user's active memberships
   */
  async getUserMemberships(username: string): Promise<Membership[]> {
    return this.membershipRepository.findActiveByUsername(username);
  }
}

