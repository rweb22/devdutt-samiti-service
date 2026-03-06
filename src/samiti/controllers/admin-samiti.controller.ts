import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SamitiService } from '../services/samiti.service';
import { CreateRootSamitiDto } from '../dto';
import { Samiti } from '../../entities';

/**
 * Admin Samiti Controller
 * Endpoints for admin operations on samitis
 * Requires ADMIN role
 */
@ApiTags('admin')
@Controller('api/v1/admin/samitis')
export class AdminSamitiController {
  constructor(private readonly samitiService: SamitiService) {}

  /**
   * Get all root samitis
   * GET /api/v1/admin/samitis
   */
  @Get()
  @ApiOperation({ summary: 'Get all root samitis' })
  @ApiResponse({ status: 200, description: 'List of root samitis' })
  async getRoots(): Promise<Samiti[]> {
    return this.samitiService.getRoots();
  }

  /**
   * Create a new root samiti
   * POST /api/v1/admin/samitis
   */
  @Post()
  @ApiOperation({ summary: 'Create a new root samiti (admin only)' })
  @ApiResponse({ status: 201, description: 'Root samiti created successfully' })
  @ApiResponse({ status: 409, description: 'Samiti with this name already exists' })
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
  @ApiOperation({ summary: 'Get samiti by ID' })
  @ApiResponse({ status: 200, description: 'Samiti details' })
  @ApiResponse({ status: 404, description: 'Samiti not found' })
  async getById(@Param('id') id: string): Promise<Samiti> {
    return this.samitiService.findById(id);
  }
}

