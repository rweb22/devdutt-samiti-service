import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { SamitiModule } from './samiti/samiti.module';
import { MembershipModule } from './membership/membership.module';
import { NcmModule } from './ncm/ncm.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    DatabaseModule,
    SamitiModule,
    MembershipModule,
    NcmModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
