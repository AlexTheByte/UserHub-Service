import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class ReferencesService {
  // /!\ not used for now
  constructor(@Inject('RPC_REFERENCES_CLIENT') private readonly rpcReferencesClient: ClientProxy) {}

  async findAll(entity: 'languages' | 'interests'): Promise<Array<any>> {
    const entitiesObs = await this.rpcReferencesClient.send(entity, 'null');
    return await lastValueFrom(entitiesObs);
  }
}
