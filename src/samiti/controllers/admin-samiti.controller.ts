import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { SamitiService } from '../services/samiti.service';
import { CreateRootSamitiDto } from '../dto';
import { Samiti } from '../../entities';

/**
 * Admin Samiti Controller
 * Endpoints for admin operations on samitis
 * Requires ADMIN role
 */
@Controller('api/v1/admin/samitis')
export class AdminSamitiController {
  constructor(private readonly samitiService: SamitiService) {}

  /**
   * Get all root samitis
   * GET /api/v1/admin/samitis
   */
  @Get()
  async getRoots(): Promise<Samiti[]> {
    return this.samitiService.getRoots();
  }

  /**
   * Create a new root samiti
   * POST /api/v1/admin/samitis
   */
  @Post()
  async createRoot(
    @Body() dto: CreateRootSamitiDto,
    // TODO: Extract from JWT token
    // @CurrentUser() user: User,
  ): Promise<Samiti> {
    // TODO: Get username from authenticated user
    const createdBy = 'admin'; // Placeholder
    return this.samitiService.createRoot(dto, createdBy);
  }

  /**
   * Get samiti by ID
   * GET /api/v1/admin/samitis/:id
   */
  @Get(':id')
  async getById(@Param('id') id: string): Promise<Samiti> {
    return this.samitiService.findById(id);
  }
}

