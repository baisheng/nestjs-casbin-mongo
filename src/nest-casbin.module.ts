import { DynamicModule, Module } from '@nestjs/common';
import { NestCasbinCoreModule } from './nest-casbin-core.module';
import { NestCasbinModuleAsyncOptions, NestCasbinModuleOptions } from './interfaces/nest-casbin.interface';

@Module({})
export class NestCasbinModule {
  static forRoot(options: NestCasbinModuleOptions) {
    return {
      module: NestCasbinModule,
      imports: [NestCasbinCoreModule.forRoot(options)],
    };
  }
  static forRootAsync(options: NestCasbinModuleAsyncOptions) {
    return {
      module: NestCasbinModule,
      imports: [NestCasbinCoreModule.forRootAsync(options)],
    };
  }
}
