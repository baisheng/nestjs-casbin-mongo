import { DynamicModule, Module } from '@nestjs/common';
import { CasbinCoreModule } from './casbin-core.module';
import { NestCasbinModuleAsyncOptions, NestCasbinModuleOptions } from './interfaces';

@Module({})
export class CasbinModule {
  static forRoot(options: NestCasbinModuleOptions) {
    return {
      module: CasbinModule,
      imports: [CasbinCoreModule.forRoot(options)],
    };
  }
  static forRootAsync(options: NestCasbinModuleAsyncOptions) {
    return {
      module: CasbinModule,
      imports: [CasbinCoreModule.forRootAsync(options)],
    };
  }
}
