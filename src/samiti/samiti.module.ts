import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Samiti, Membership, MembershipChange, SamitiRoleOffer } from '../entities';
import { SamitiRepository } from './repositories/samiti.repository';
import { SamitiService } from './services/samiti.service';
import { AdminSamitiController } from './controllers/admin-samiti.controller';
import { SamitiBrowseController } from './controllers/samiti-browse.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Samiti,
      Membership,
      MembershipChange,
      SamitiRoleOffer,
    ]),
  ],
  controllers: [AdminSamitiController, SamitiBrowseController],
  providers: [SamitiRepository, SamitiService],
  exports: [SamitiService, SamitiRepository],
})
export class SamitiModule {}

