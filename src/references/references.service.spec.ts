import { Test, TestingModule } from '@nestjs/testing';
import { ReferencesService } from './references.service';
import { ClientProxy, ClientProxyFactory, Transport } from '@nestjs/microservices';
import { of } from 'rxjs';

describe('ReferencesService', () => {
  let referencesService: ReferencesService;
  let rpcReferencesClient: ClientProxy;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReferencesService,
        {
          provide: 'RPC_REFERENCES_CLIENT',
          useValue: { send: jest.fn(), close: jest.fn() },
        },
      ],
    }).compile();

    referencesService = module.get<ReferencesService>(ReferencesService);
    rpcReferencesClient = module.get<ClientProxy>('RPC_REFERENCES_CLIENT');
  });

  describe('findAll', () => {
    it('should fetch references', async () => {
      const mockResponse = [
        { id: 0, key: 'key0' },
        { id: 1, key: 'key0' },
      ];
      const sendSpy = jest.spyOn(rpcReferencesClient, 'send').mockReturnValue(of(mockResponse));
      const entity = 'languages';

      const result = await referencesService.findAll(entity);

      expect(sendSpy).toHaveBeenCalledWith(entity, 'null');
      expect(result).toEqual(mockResponse);
    });
  });

  afterAll(async () => {
    await rpcReferencesClient.close();
  });
});
