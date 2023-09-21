import { Module } from '@nestjs/common';
import { ReferencesService } from './references.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { IRpcReferencesConfig } from 'src/config/rpc-references.configuration';

@Module({
  imports: [
    ClientsModule.registerAsync({
      // TODO : Voir comment mettre ça sous AppModule.ts puis faire l'envoi de mail pour l'update de password.
      clients: [
        {
          name: 'RPC_REFERENCES_CLIENT',
          useFactory: async (configService: ConfigService) => ({
            transport: Transport.TCP,
            options: { ...configService.get<IRpcReferencesConfig>('rpc-references') },
          }),
          inject: [ConfigService],
        },
      ],
    }),
  ],
  controllers: [],
  providers: [ReferencesService],
  exports: [ReferencesService],
})
export class ReferencesModule {}
