import {
  Controller,
  Get,
  Post,
  Body,
  Param,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { NcmService } from '../services/ncm.service';
import { InitiateNcmDto, VoteNcmDto } from '../dto';
import { NcmMotion, NcmSignature, NcmVote } from '../../entities';

/**
 * NCM Controller
 * Endpoints for No Confidence Motion workflow
 */
@ApiTags('ncm')
@Controller('api/v1/samitis/:samitiId/ncm')
export class NcmController {
  constructor(private readonly ncmService: NcmService) {}

  /**
   * Initiate a No Confidence Motion
   * POST /api/v1/samitis/:samitiId/ncm
   */
  @Post()
  async initiateMotion(
    @Param('samitiId') samitiId: string,
    @Body() dto: InitiateNcmDto,
    // TODO: Extract from JWT token
    // @CurrentUser() user: User,
  ): Promise<NcmMotion> {
    // TODO: Get username from authenticated user
    const initiatedBy = 'member'; // Placeholder
    return this.ncmService.initiateMotion(samitiId, initiatedBy, dto.reason);
  }

  /**
   * Get all motions for a samiti
   * GET /api/v1/samitis/:samitiId/ncm
   */
  @Get()
  async getMotions(@Param('samitiId') samitiId: string): Promise<NcmMotion[]> {
    return this.ncmService.getSamitiMotions(samitiId);
  }

  /**
   * Get a specific motion
   * GET /api/v1/samitis/:samitiId/ncm/:motionId
   */
  @Get(':motionId')
  async getMotion(@Param('motionId') motionId: string): Promise<NcmMotion> {
    return this.ncmService.getMotion(motionId);
  }

  /**
   * Sign a motion (add signature)
   * POST /api/v1/samitis/:samitiId/ncm/:motionId/sign
   */
  @Post(':motionId/sign')
  async signMotion(
    @Param('motionId') motionId: string,
    // TODO: Extract from JWT token
    // @CurrentUser() user: User,
  ): Promise<NcmSignature> {
    // TODO: Get username from authenticated user
    const username = 'member'; // Placeholder
    return this.ncmService.signMotion(motionId, username);
  }

  /**
   * Vote on a motion
   * POST /api/v1/samitis/:samitiId/ncm/:motionId/vote
   */
  @Post(':motionId/vote')
  async voteOnMotion(
    @Param('motionId') motionId: string,
    @Body() dto: VoteNcmDto,
    // TODO: Extract from JWT token
    // @CurrentUser() user: User,
  ): Promise<NcmVote> {
    // TODO: Get username from authenticated user
    const username = 'member'; // Placeholder
    return this.ncmService.voteOnMotion(motionId, username, dto.voteType);
  }

  /**
   * Finalize voting (admin/system action)
   * POST /api/v1/samitis/:samitiId/ncm/:motionId/finalize
   */
  @Post(':motionId/finalize')
  async finalizeVoting(@Param('motionId') motionId: string): Promise<NcmMotion> {
    return this.ncmService.finalizeVoting(motionId);
  }

  /**
   * Get signatures for a motion
   * GET /api/v1/samitis/:samitiId/ncm/:motionId/signatures
   */
  @Get(':motionId/signatures')
  async getSignatures(@Param('motionId') motionId: string): Promise<NcmSignature[]> {
    return this.ncmService.getSignatures(motionId);
  }

  /**
   * Get votes for a motion
   * GET /api/v1/samitis/:samitiId/ncm/:motionId/votes
   */
  @Get(':motionId/votes')
  async getVotes(@Param('motionId') motionId: string): Promise<NcmVote[]> {
    return this.ncmService.getVotes(motionId);
  }
}

