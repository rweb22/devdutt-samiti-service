# Devdutt - samiti-service

Part of the **Devdutt Institute Virtual Sansad** platform - A digital parliament enabling structured discourse, evidence-based deliberation, and democratic decision-making.

**Status:** ✅ Core features complete, ready for testing
**Version:** 0.1.0
**Port:** 3002

## Description

NestJS microservice for managing Samiti (governance committee) hierarchy, memberships, and No Confidence Motions.

### ✅ Features Implemented

- **Samiti Hierarchy Management** - Create root/child samitis with PostgreSQL ltree for efficient hierarchical queries
- **Membership Management** - Appoint, promote, remove members with complete audit trail
- **Role Offer Workflow** - Async role appointment workflow (create → accept/reject)
- **No Confidence Motion (NCM)** - Complete state machine workflow for removing sabhapatis

### 📊 Statistics

- **API Endpoints:** 27
- **Database Tables:** 7 (with ltree extension)
- **Entities:** 7
- **Services:** 4
- **Controllers:** 5
- **Lines of Code:** ~2,500+

## Tech Stack

- **Runtime:** Node.js 20 LTS
- **Framework:** NestJS 11.0.16
- **Language:** TypeScript 5.x
- **Database:** PostgreSQL 16 (with LTREE extension)
- **Cache:** Redis 7
- **Storage:** MinIO (S3-compatible)

## Getting Started

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Run in development mode
npm run start:dev

# Run tests
npm test

# Build for production
npm run build
```

## Database Setup

```bash
# Run migrations to create database schema
./run-migrations.sh
```

This will:
- Create database if it doesn't exist
- Enable PostgreSQL ltree extension
- Create all 7 tables with indexes and constraints
- Set up ltree path auto-computation trigger

## API Documentation

### Health Check
- `GET /health` - Service health status

### Admin Endpoints (3)
- `GET /api/v1/admin/samitis` - List root samitis
- `POST /api/v1/admin/samitis` - Create root samiti
- `GET /api/v1/admin/samitis/:id` - Get samiti by ID

### Browse Endpoints (6)
- `GET /api/v1/samitis` - List root samitis
- `GET /api/v1/samitis/:id` - Get samiti details
- `GET /api/v1/samitis/:id/children` - Get direct children
- `GET /api/v1/samitis/:id/descendants` - Get all descendants
- `GET /api/v1/samitis/:id/ancestors` - Get all ancestors
- `GET /api/v1/samitis/:id/path` - Get path from root

### Sabhapati Endpoints (6)
- `POST /api/v1/sabhapati/samitis/:id/children` - Create child samiti
- `POST /api/v1/sabhapati/samitis/:id/members` - Appoint member
- `DELETE /api/v1/sabhapati/samitis/:id/members/:username` - Remove member
- `POST /api/v1/sabhapati/samitis/:id/members/:username/promote` - Promote member
- `POST /api/v1/sabhapati/samitis/:id/offers` - Create role offer
- `GET /api/v1/sabhapati/samitis/:id/members` - Get all members

### Role Offer Endpoints (4)
- `GET /api/v1/offers/pending` - Get pending offers
- `GET /api/v1/offers` - Get all offers
- `POST /api/v1/offers/:id/accept` - Accept offer
- `POST /api/v1/offers/:id/reject` - Reject offer

### NCM Endpoints (8)
- `POST /api/v1/samitis/:samitiId/ncm` - Initiate NCM
- `GET /api/v1/samitis/:samitiId/ncm` - Get all motions
- `GET /api/v1/samitis/:samitiId/ncm/:motionId` - Get motion details
- `POST /api/v1/samitis/:samitiId/ncm/:motionId/sign` - Sign motion
- `POST /api/v1/samitis/:samitiId/ncm/:motionId/vote` - Vote on motion
- `POST /api/v1/samitis/:samitiId/ncm/:motionId/finalize` - Finalize voting
- `GET /api/v1/samitis/:samitiId/ncm/:motionId/signatures` - Get signatures
- `GET /api/v1/samitis/:samitiId/ncm/:motionId/votes` - Get votes

**Total:** 27 API endpoints

Swagger documentation will be available at `http://localhost:3002/api` (TODO).

## Project Structure

```
src/
├── modules/          # Feature modules
├── common/           # Shared utilities, guards, interceptors
├── config/           # Configuration files
└── main.ts           # Application entry point
```

## Environment Variables

See `.env.example` for required environment variables.

## Documentation

See [devdutt-docs](https://github.com/rweb22/devdutt-docs) for comprehensive documentation.

## Project Ecosystem

This repository is part of the Devdutt Institute microservices architecture. See the [Devdutt GitHub Project](https://github.com/users/rweb22/projects) for the complete ecosystem.

## License

MIT License - See LICENSE file for details.
