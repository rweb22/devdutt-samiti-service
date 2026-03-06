import { Injectable } from '@nestjs/common';
import { DataSource, Repository, IsNull } from 'typeorm';
import { Samiti } from '../../entities/samiti.entity';

/**
 * Samiti Repository
 * Handles database operations for Samiti entities with ltree support
 */
@Injectable()
export class SamitiRepository extends Repository<Samiti> {
  constructor(private dataSource: DataSource) {
    super(Samiti, dataSource.createEntityManager());
  }

  /**
   * Find all root samitis (no parent)
   */
  async findRoots(): Promise<Samiti[]> {
    return this.find({
      where: { parentId: IsNull() },
      order: { createdAt: 'DESC' },
    });
  }

  /**
   * Find samiti by path (ltree)
   */
  async findByPath(path: string): Promise<Samiti | null> {
    return this.findOne({ where: { path } });
  }

  /**
   * Find all children of a samiti (direct children only)
   */
  async findChildren(samitiId: string): Promise<Samiti[]> {
    return this.find({
      where: { parentId: samitiId },
      order: { name: 'ASC' },
    });
  }

  /**
   * Find all descendants of a samiti (all levels) using ltree
   * Uses ltree @> operator (ancestor of)
   */
  async findDescendants(path: string): Promise<Samiti[]> {
    return this.createQueryBuilder('samiti')
      .where('samiti.path <@ :path::ltree', { path })
      .andWhere('samiti.path != :path::ltree', { path })
      .orderBy('samiti.path', 'ASC')
      .getMany();
  }

  /**
   * Find all ancestors of a samiti (all levels) using ltree
   * Uses ltree @> operator (ancestor of)
   */
  async findAncestors(path: string): Promise<Samiti[]> {
    return this.createQueryBuilder('samiti')
      .where('samiti.path @> :path::ltree', { path })
      .andWhere('samiti.path != :path::ltree', { path })
      .orderBy('samiti.path', 'ASC')
      .getMany();
  }

  /**
   * Get the path from root to a samiti (including the samiti itself)
   */
  async getPathToRoot(path: string): Promise<Samiti[]> {
    return this.createQueryBuilder('samiti')
      .where('samiti.path @> :path::ltree', { path })
      .orderBy('samiti.path', 'ASC')
      .getMany();
  }

  /**
   * Check if a name is unique among siblings
   */
  async isNameUniqueAmongSiblings(
    name: string,
    parentId: string | null,
    excludeId?: string,
  ): Promise<boolean> {
    const query = this.createQueryBuilder('samiti')
      .where('LOWER(samiti.name) = LOWER(:name)', { name });

    if (parentId === null) {
      query.andWhere('samiti.parentId IS NULL');
    } else {
      query.andWhere('samiti.parentId = :parentId', { parentId });
    }

    if (excludeId) {
      query.andWhere('samiti.id != :excludeId', { excludeId });
    }

    const count = await query.getCount();
    return count === 0;
  }

  /**
   * Find samitis by sabhapati username
   */
  async findBySabhapati(username: string): Promise<Samiti[]> {
    return this.find({
      where: { sabhapatiUsername: username },
      order: { path: 'ASC' },
    });
  }

  /**
   * Find vacant samitis (no sabhapati)
   */
  async findVacant(): Promise<Samiti[]> {
    return this.createQueryBuilder('samiti')
      .where('samiti.leadershipStatus = :status', { status: 'VACANT' })
      .orderBy('samiti.vacantSince', 'ASC')
      .getMany();
  }

  /**
   * Count total samitis
   */
  async countAll(): Promise<number> {
    return this.count();
  }

  /**
   * Count children of a samiti
   */
  async countChildren(samitiId: string): Promise<number> {
    return this.count({ where: { parentId: samitiId } });
  }

  /**
   * Get depth of a samiti in the hierarchy
   */
  async getDepth(path: string): Promise<number> {
    const samiti = await this.findByPath(path);
    return samiti ? samiti.getDepth() : 0;
  }
}

