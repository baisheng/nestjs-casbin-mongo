import { DynamicModule, Module, Provider, Global, Type } from '@nestjs/common';
import { newEnforcer } from 'casbin';
import { v4 as uuid } from 'uuid';
import { CasbinService } from './casbin.service';
import {
  CASBIN_ENFORCER,
  NEST_CASBIN_MODULE_ID,
  NEST_CASBIN_OPTION
} from './casbin.constants';

import {
  NestCasbinModuleAsyncOptions,
  NestCasbinModuleOptions, NestCasbinOptionsFactory
} from './interfaces';
import { MongoAdapter } from 'casbin-mongodb-adapter';


export const generateString = () => uuid();

@Global()
@Module({
  providers: [CasbinService],
  exports: [CasbinService],
})
export class CasbinCoreModule {

  public static forRoot(options: NestCasbinModuleOptions) {
      const casbinEnforcerProvider: Provider = {
        provide: CASBIN_ENFORCER,
        useFactory: async () => {
          const adapter = await MongoAdapter.newAdapter({
            uri: options.uri,
            collection: options.collectionName || 'casbins',
            database: options.databaseName || 'node-casbin-official',
            option: options.clientOptions,
          });
          // const enforcer = await newEnforcer(options.model, options.adapter);
          const enforcer = await newEnforcer(options.casbinModelPath, adapter);
          await enforcer.loadPolicy();
          return enforcer;
        },
      };
      return {
        exports: [casbinEnforcerProvider, CasbinService],
        module: CasbinCoreModule,
        providers: [casbinEnforcerProvider, CasbinService],
      };
  }
  static forRootAsync(options: NestCasbinModuleAsyncOptions) {
    const casbinEnforcerProvider = {
      provide: CASBIN_ENFORCER,
      useFactory: async (casbinOptions) => {
        const adapter = await MongoAdapter.newAdapter({
          uri: casbinOptions.uri,
          collection: casbinOptions.collectionName || 'roles',
          database: casbinOptions.databaseName || 'casbin-official',
          option: casbinOptions.clientOptions,
        });
        const enforcer = await newEnforcer(casbinOptions.casbinModelPath, adapter);
        await enforcer.loadPolicy();
        return enforcer;
      },
      inject: [NEST_CASBIN_OPTION],
    };
    const asyncProviders = this.createAsyncProviders(options);
    return {
      module: CasbinCoreModule,
      imports: options.imports,
      providers: [
        ...asyncProviders,
        casbinEnforcerProvider,
        CasbinService,
        {
          provide: NEST_CASBIN_MODULE_ID,
          useValue: generateString(),
        },
      ],
      exports: [casbinEnforcerProvider, CasbinService],
    };
  }

  private static createAsyncProviders(
    options: NestCasbinModuleAsyncOptions,
  ): Provider[] {
    if (options.useExisting || options.useFactory) {
      return [this.createAsyncOptionsProvider(options)];
    }
    const useClass = options.useClass as Type<NestCasbinOptionsFactory>;
    return [
      this.createAsyncOptionsProvider(options),
      {
        provide: useClass,
        useClass,
      },
    ];
  }

  private static createAsyncOptionsProvider(
    options: NestCasbinModuleAsyncOptions,
  ): Provider {
    if (options.useFactory) {
      return {
        provide: NEST_CASBIN_OPTION,
        useFactory: options.useFactory,
        inject: options.inject || [],
      };
    }
    const inject = [
      (options.useClass || options.useExisting) as Type<NestCasbinOptionsFactory>,
    ];
    return {
      provide: NEST_CASBIN_OPTION,
      useFactory: async (optionsFactory: NestCasbinOptionsFactory) =>
        await optionsFactory.createCasbinOptions(),
      inject,
    };
  }
}
