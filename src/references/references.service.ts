import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class ReferencesService {
  constructor(@Inject('RPC_REFERENCES_CLIENT') private readonly rpcReferencesClient: ClientProxy) {}

  async findAll(entity: 'languages' | 'interests'): Promise<Array<any>> {
    const entitiesObs = await this.rpcReferencesClient.send(entity, 'null');
    return lastValueFrom(entitiesObs);
  }
}
