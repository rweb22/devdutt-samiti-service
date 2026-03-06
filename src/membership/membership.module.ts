import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  Samiti,
  Membership,
  MembershipChange,
  SamitiRoleOffer,
} from '../entities';
import { MembershipRepository } from './repositories/membership.repository';
import { MembershipChangeRepository } from './repositories/membership-change.repository';
import { RoleOfferRepository } from './repositories/role-offer.repository';
import { MembershipService } from './services/membership.service';
import { RoleOfferService } from './services/role-offer.service';
import { SabhapatiController } from './controllers/sabhapati.controller';
import { RoleOfferController } from './controllers/role-offer.controller';
import { SamitiModule } from '../samiti/samiti.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Samiti,
      Membership,
      MembershipChange,
      SamitiRoleOffer,
    ]),
    SamitiModule, // Import SamitiModule to use SamitiService
  ],
  controllers: [SabhapatiController, RoleOfferController],
  providers: [
    MembershipRepository,
    MembershipChangeRepository,
    RoleOfferRepository,
    MembershipService,
    RoleOfferService,
  ],
  exports: [MembershipService, RoleOfferService],
})
export class MembershipModule {}

