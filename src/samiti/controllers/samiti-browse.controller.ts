import {
  Controller,
  Get,
  Param,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SamitiService } from '../services/samiti.service';
import { Samiti } from '../../entities';

/**
 * Samiti Browse Controller
 * Public endpoints for browsing samiti hierarchy
 */
@ApiTags('samitis')
@Controller('api/v1/samitis')
export class SamitiBrowseController {
  constructor(private readonly samitiService: SamitiService) {}

  /**
   * Get all root samitis
   * GET /api/v1/samitis
   */
  @Get()
  async getRoots(): Promise<Samiti[]> {
    return this.samitiService.getRoots();
  }

  /**
   * Get samiti by ID
   * GET /api/v1/samitis/:id
   */
  @Get(':id')
  async getById(@Param('id') id: string): Promise<Samiti> {
    return this.samitiService.findById(id);
  }

  /**
   * Get children of a samiti
   * GET /api/v1/samitis/:id/children
   */
  @Get(':id/children')
  async getChildren(@Param('id') id: string): Promise<Samiti[]> {
    return this.samitiService.getChildren(id);
  }

  /**
   * Get all descendants of a samiti (all levels)
   * GET /api/v1/samitis/:id/descendants
   */
  @Get(':id/descendants')
  async getDescendants(@Param('id') id: string): Promise<Samiti[]> {
    return this.samitiService.getDescendants(id);
  }

  /**
   * Get all ancestors of a samiti (all levels)
   * GET /api/v1/samitis/:id/ancestors
   */
  @Get(':id/ancestors')
  async getAncestors(@Param('id') id: string): Promise<Samiti[]> {
    return this.samitiService.getAncestors(id);
  }

  /**
   * Get path from root to samiti
   * GET /api/v1/samitis/:id/path
   */
  @Get(':id/path')
  async getPath(@Param('id') id: string): Promise<Samiti[]> {
    return this.samitiService.getPathToRoot(id);
  }
}

