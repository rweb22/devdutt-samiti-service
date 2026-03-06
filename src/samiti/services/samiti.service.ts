import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { SamitiRepository } from '../repositories/samiti.repository';
import { Samiti, LeadershipStatus } from '../../entities';
import { CreateRootSamitiDto, CreateChildSamitiDto, UpdateSamitiDto } from '../dto';

/**
 * Samiti Service
 * Business logic for Samiti operations
 */
@Injectable()
export class SamitiService {
  private readonly MAX_DEPTH = 10;

  constructor(private readonly samitiRepository: SamitiRepository) {}

  /**
   * Create a root samiti (admin only)
   */
  async createRoot(dto: CreateRootSamitiDto, createdBy: string): Promise<Samiti> {
    // Validate name uniqueness among roots
    const isUnique = await this.samitiRepository.isNameUniqueAmongSiblings(
      dto.name,
      null,
    );
    if (!isUnique) {
      throw new ConflictException(
        `A root samiti with name '${dto.name}' already exists`,
      );
    }

    // Create samiti
    const samiti = this.samitiRepository.create({
      name: dto.name,
      title: dto.title,
      parentId: null,
      leadershipStatus: LeadershipStatus.VACANT,
      createdByUsername: createdBy,
    });

    return this.samitiRepository.save(samiti);
  }

  /**
   * Create a child samiti (sabhapati only)
   */
  async createChild(
    parentId: string,
    dto: CreateChildSamitiDto,
    createdBy: string,
  ): Promise<Samiti> {
    // Verify parent exists
    const parent = await this.findById(parentId);

    // Check depth limit
    const parentDepth = parent.getDepth();
    if (parentDepth >= this.MAX_DEPTH) {
      throw new BadRequestException(
        `Maximum hierarchy depth (${this.MAX_DEPTH}) reached`,
      );
    }

    // Validate name uniqueness among siblings
    const isUnique = await this.samitiRepository.isNameUniqueAmongSiblings(
      dto.name,
      parentId,
    );
    if (!isUnique) {
      throw new ConflictException(
        `A child samiti with name '${dto.name}' already exists under this parent`,
      );
    }

    // Create samiti
    const samiti = this.samitiRepository.create({
      name: dto.name,
      title: dto.title,
      parentId,
      leadershipStatus: LeadershipStatus.VACANT,
      createdByUsername: createdBy,
    });

    return this.samitiRepository.save(samiti);
  }

  /**
   * Find samiti by ID
   */
  async findById(id: string): Promise<Samiti> {
    const samiti = await this.samitiRepository.findOne({ where: { id } });
    if (!samiti) {
      throw new NotFoundException(`Samiti with ID '${id}' not found`);
    }
    return samiti;
  }

  /**
   * Find samiti by path
   */
  async findByPath(path: string): Promise<Samiti> {
    const samiti = await this.samitiRepository.findByPath(path);
    if (!samiti) {
      throw new NotFoundException(`Samiti with path '${path}' not found`);
    }
    return samiti;
  }

  /**
   * Get all root samitis
   */
  async getRoots(): Promise<Samiti[]> {
    return this.samitiRepository.findRoots();
  }

  /**
   * Get children of a samiti
   */
  async getChildren(samitiId: string): Promise<Samiti[]> {
    // Verify samiti exists
    await this.findById(samitiId);
    return this.samitiRepository.findChildren(samitiId);
  }

  /**
   * Get all descendants of a samiti (all levels)
   */
  async getDescendants(samitiId: string): Promise<Samiti[]> {
    const samiti = await this.findById(samitiId);
    return this.samitiRepository.findDescendants(samiti.path);
  }

  /**
   * Get all ancestors of a samiti (all levels)
   */
  async getAncestors(samitiId: string): Promise<Samiti[]> {
    const samiti = await this.findById(samitiId);
    return this.samitiRepository.findAncestors(samiti.path);
  }

  /**
   * Get path from root to samiti
   */
  async getPathToRoot(samitiId: string): Promise<Samiti[]> {
    const samiti = await this.findById(samitiId);
    return this.samitiRepository.getPathToRoot(samiti.path);
  }

  /**
   * Update samiti name and/or title
   */
  async update(id: string, dto: UpdateSamitiDto): Promise<Samiti> {
    const samiti = await this.findById(id);

    // If name is being changed, validate uniqueness
    if (dto.name && dto.name !== samiti.name) {
      const isUnique = await this.samitiRepository.isNameUniqueAmongSiblings(
        dto.name,
        samiti.parentId,
        id,
      );
      if (!isUnique) {
        throw new ConflictException(
          `A samiti with name '${dto.name}' already exists among siblings`,
        );
      }
      samiti.name = dto.name;
    }

    if (dto.title !== undefined) {
      samiti.title = dto.title;
    }

    return this.samitiRepository.save(samiti);
  }
}

