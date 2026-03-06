import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  NcmMotion,
  NcmSignature,
  NcmVote,
  Samiti,
  Membership,
} from '../entities';
import { NcmMotionRepository } from './repositories/ncm-motion.repository';
import { NcmSignatureRepository } from './repositories/ncm-signature.repository';
import { NcmVoteRepository } from './repositories/ncm-vote.repository';
import { NcmService } from './services/ncm.service';
import { NcmController } from './controllers/ncm.controller';
import { SamitiModule } from '../samiti/samiti.module';
import { MembershipModule } from '../membership/membership.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      NcmMotion,
      NcmSignature,
      NcmVote,
      Samiti,
      Membership,
    ]),
    SamitiModule,
    MembershipModule,
  ],
  controllers: [NcmController],
  providers: [
    NcmMotionRepository,
    NcmSignatureRepository,
    NcmVoteRepository,
    NcmService,
  ],
  exports: [NcmService],
})
export class NcmModule {}

