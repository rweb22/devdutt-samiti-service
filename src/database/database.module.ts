import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  Samiti,
  Membership,
  MembershipChange,
  SamitiRoleOffer,
} from '../entities';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST', 'localhost'),
        port: configService.get('DB_PORT', 5432),
        username: configService.get('DB_USER', 'devdutt'),
        password: configService.get('DB_PASSWORD', 'devdutt_secret'),
        database: configService.get('DB_NAME', 'devdutt_samiti'),
        entities: [
          Samiti,
          Membership,
          MembershipChange,
          SamitiRoleOffer,
        ],
        synchronize: false, // Use migrations instead
        logging: configService.get('NODE_ENV') === 'development',
      }),
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}

