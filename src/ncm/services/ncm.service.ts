import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { NcmMotionRepository } from '../repositories/ncm-motion.repository';
import { NcmSignatureRepository } from '../repositories/ncm-signature.repository';
import { NcmVoteRepository } from '../repositories/ncm-vote.repository';
import { SamitiRepository } from '../../samiti/repositories/samiti.repository';
import { MembershipRepository } from '../../membership/repositories/membership.repository';
import {
  NcmMotion,
  NcmSignature,
  NcmVote,
  NcmStatus,
  NcmVoteType,
  LeadershipStatus,
} from '../../entities';

/**
 * NCM Service
 * Business logic for No Confidence Motion workflow
 */
@Injectable()
export class NcmService {
  private readonly DEFAULT_SIGNATURE_THRESHOLD = 3; // Configurable

  constructor(
    private readonly ncmMotionRepository: NcmMotionRepository,
    private readonly ncmSignatureRepository: NcmSignatureRepository,
    private readonly ncmVoteRepository: NcmVoteRepository,
    private readonly samitiRepository: SamitiRepository,
    private readonly membershipRepository: MembershipRepository,
  ) {}

  /**
   * Initiate a No Confidence Motion
   */
  async initiateMotion(
    samitiId: string,
    initiatedBy: string,
    reason: string,
  ): Promise<NcmMotion> {
    // Verify samiti exists
    const samiti = await this.samitiRepository.findOne({ where: { id: samitiId } });
    if (!samiti) {
      throw new NotFoundException(`Samiti with ID '${samitiId}' not found`);
    }

    // Verify samiti has a sabhapati
    if (!samiti.sabhapatiUsername) {
      throw new BadRequestException('Samiti does not have a sabhapati');
    }

    // Verify initiator is a member
    const isMember = await this.membershipRepository.hasActiveMembership(
      initiatedBy,
      samitiId,
    );
    if (!isMember) {
      throw new BadRequestException(
        'Only members can initiate a No Confidence Motion',
      );
    }

    // Check if there's already an active motion
    const activeMotion = await this.ncmMotionRepository.findActiveMotion(samitiId);
    if (activeMotion) {
      throw new ConflictException(
        'There is already an active No Confidence Motion for this samiti',
      );
    }

    // Create motion
    const motion = this.ncmMotionRepository.create({
      samitiId,
      targetSabhapatiUsername: samiti.sabhapatiUsername,
      initiatedByUsername: initiatedBy,
      reason,
      status: NcmStatus.COLLECTING_SIGNATURES,
      signatureThreshold: this.DEFAULT_SIGNATURE_THRESHOLD,
      signaturesCount: 0,
    });

    return this.ncmMotionRepository.save(motion);
  }

  /**
   * Sign a motion (add signature)
   */
  async signMotion(motionId: string, username: string): Promise<NcmSignature> {
    // Get motion
    const motion = await this.ncmMotionRepository.findOne({
      where: { id: motionId },
    });
    if (!motion) {
      throw new NotFoundException(`Motion with ID '${motionId}' not found`);
    }

    // Verify motion is in COLLECTING_SIGNATURES status
    if (motion.status !== NcmStatus.COLLECTING_SIGNATURES) {
      throw new BadRequestException(
        `Motion is in ${motion.status} status, cannot collect signatures`,
      );
    }

    // Verify user is a member
    const isMember = await this.membershipRepository.hasActiveMembership(
      username,
      motion.samitiId,
    );
    if (!isMember) {
      throw new BadRequestException('Only members can sign a motion');
    }

    // Check if user already signed
    const hasSigned = await this.ncmSignatureRepository.hasSigned(motionId, username);
    if (hasSigned) {
      throw new ConflictException('You have already signed this motion');
    }

    // Create signature
    const signature = this.ncmSignatureRepository.create({
      ncmMotionId: motionId,
      username,
    });
    const saved = await this.ncmSignatureRepository.save(signature);

    // Increment signature count
    await this.ncmMotionRepository.incrementSignatureCount(motionId);

    // Check if threshold is met
    const updatedMotion = await this.ncmMotionRepository.findOne({
      where: { id: motionId },
    });
    if (updatedMotion && updatedMotion.isSignatureThresholdMet()) {
      // Move to voting phase
      await this.moveToVoting(updatedMotion);
    }

    return saved;
  }

  /**
   * Vote on a motion
   */
  async voteOnMotion(
    motionId: string,
    username: string,
    voteType: NcmVoteType,
  ): Promise<NcmVote> {
    // Get motion
    const motion = await this.ncmMotionRepository.findOne({
      where: { id: motionId },
    });
    if (!motion) {
      throw new NotFoundException(`Motion with ID '${motionId}' not found`);
    }

    // Verify motion is in VOTING status
    if (motion.status !== NcmStatus.VOTING) {
      throw new BadRequestException(
        `Motion is in ${motion.status} status, cannot vote`,
      );
    }

    // Verify user is a member
    const isMember = await this.membershipRepository.hasActiveMembership(
      username,
      motion.samitiId,
    );
    if (!isMember) {
      throw new BadRequestException('Only members can vote on a motion');
    }

    // Check if user already voted
    const hasVoted = await this.ncmVoteRepository.hasVoted(motionId, username);
    if (hasVoted) {
      throw new ConflictException('You have already voted on this motion');
    }

    // Create vote
    const vote = this.ncmVoteRepository.create({
      ncmMotionId: motionId,
      username,
      voteType,
    });
    const saved = await this.ncmVoteRepository.save(vote);

    // Increment vote count
    await this.ncmMotionRepository.incrementVoteCount(motionId, voteType);

    return saved;
  }

  /**
   * Finalize voting and determine outcome
   */
  async finalizeVoting(motionId: string): Promise<NcmMotion> {
    const motion = await this.ncmMotionRepository.findOne({
      where: { id: motionId },
    });
    if (!motion) {
      throw new NotFoundException(`Motion with ID '${motionId}' not found`);
    }

    if (motion.status !== NcmStatus.VOTING) {
      throw new BadRequestException('Motion is not in voting status');
    }

    // Determine outcome
    if (motion.isPassed()) {
      motion.status = NcmStatus.PASSED;
      motion.votingEndedAt = new Date();
      await this.ncmMotionRepository.save(motion);

      // Remove sabhapati
      await this.removeSabhapati(motion.samitiId);
    } else {
      motion.status = NcmStatus.FAILED;
      motion.votingEndedAt = new Date();
      await this.ncmMotionRepository.save(motion);
    }

    return motion;
  }

  /**
   * Get motion by ID
   */
  async getMotion(motionId: string): Promise<NcmMotion> {
    const motion = await this.ncmMotionRepository.findOne({
      where: { id: motionId },
    });
    if (!motion) {
      throw new NotFoundException(`Motion with ID '${motionId}' not found`);
    }
    return motion;
  }

  /**
   * Get all motions for a samiti
   */
  async getSamitiMotions(samitiId: string): Promise<NcmMotion[]> {
    return this.ncmMotionRepository.findBySamiti(samitiId);
  }

  /**
   * Get signatures for a motion
   */
  async getSignatures(motionId: string): Promise<NcmSignature[]> {
    return this.ncmSignatureRepository.findByMotion(motionId);
  }

  /**
   * Get votes for a motion
   */
  async getVotes(motionId: string): Promise<NcmVote[]> {
    return this.ncmVoteRepository.findByMotion(motionId);
  }

  /**
   * Move motion to voting phase
   */
  private async moveToVoting(motion: NcmMotion): Promise<void> {
    motion.status = NcmStatus.VOTING;
    motion.votingStartedAt = new Date();
    await this.ncmMotionRepository.save(motion);
  }

  /**
   * Remove sabhapati after NCM passes
   */
  private async removeSabhapati(samitiId: string): Promise<void> {
    const samiti = await this.samitiRepository.findOne({ where: { id: samitiId } });
    if (samiti) {
      samiti.sabhapatiUsername = null;
      samiti.leadershipStatus = LeadershipStatus.VACANT;
      samiti.vacantSince = new Date();
      await this.samitiRepository.save(samiti);
    }
  }
}

