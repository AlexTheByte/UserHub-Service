import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './local.strategy';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { Auth } from './entities/auth.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { IJWTConfig } from 'src/config/jwt.configuration';
import { AuthRpcConsumer } from './auth-rpc.consumer';
import { LoggerModule } from '@travel-1/travel-sdk';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { IRedisConfig } from 'src/config/redis.configuration';

@Module({
  controllers: [AuthController, AuthRpcConsumer],
  imports: [
    TypeOrmModule.forFeature([Auth]),
    PassportModule,
    JwtModule.registerAsync({
      useFactory: async (configService: ConfigService) => {
        return { ...configService.get<IJWTConfig>('jwt') };
      },
      inject: [ConfigService],
    }),
    ClientsModule.registerAsync({
      // TODO : Voir comment mettre ça sous AppModule.ts puis faire l'envoi de mail pour l'update de password.
      clients: [
        {
          name: 'REDIS_EVENT_CLIENT',
          useFactory: async (configService: ConfigService) => ({
            transport: Transport.REDIS,
            options: { ...configService.get<IRedisConfig>('redis') },
          }),
          inject: [ConfigService],
        },
      ],
    }),
    LoggerModule,
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
