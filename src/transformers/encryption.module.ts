import { DynamicModule, Module } from '@nestjs/common';
import EncryptionService from './encryption.service';
import EncryptionTransformer from './encryption.transformer';

// interface ModuleOptions {
//   key: string;
// }

// export const myModuleOptionsFactory = async ({ key }: { key: string }): Promise<ModuleOptions> => {
//   return {
//     key,
//   };
// };

@Module({
  providers: [
    EncryptionService,
    EncryptionTransformer,
    // {
    //   provide: ModuleOptions,
    //   useValue: myModuleOptionsFactory,
    // },
  ],
  exports: [EncryptionService, EncryptionTransformer],
})
export default class EncryptionModule {
  // static forRootAsync(): DynamicModule {
  //   return {
  //     module: EncryptionModule,
  //     imports: [],
  //     providers: [
  //       {
  //         provide: ModuleOptions,
  //         useFactory: myModuleOptionsFactory,
  //       },
  //     ],
  //   };
  // }
}
