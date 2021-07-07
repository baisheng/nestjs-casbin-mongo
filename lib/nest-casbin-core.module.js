"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var NestCasbinCoreModule_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.NestCasbinCoreModule = exports.generateString = void 0;
const common_1 = require("@nestjs/common");
const casbin_1 = require("casbin");
const uuid_1 = require("uuid");
const nest_casbin_service_1 = require("./nest-casbin.service");
const nest_casbin_constants_1 = require("./nest-casbin.constants");
const casbin_mongodb_adapter_1 = require("casbin-mongodb-adapter");
const generateString = () => uuid_1.v4();
exports.generateString = generateString;
let NestCasbinCoreModule = NestCasbinCoreModule_1 = class NestCasbinCoreModule {
    static forRoot(options) {
        const casbinEnforcerProvider = {
            provide: nest_casbin_constants_1.CASBIN_ENFORCER,
            useFactory: async () => {
                const adapter = await casbin_mongodb_adapter_1.MongoAdapter.newAdapter({
                    uri: options.uri,
                    collection: options.collectionName || 'casbins',
                    database: options.databaseName || 'node-casbin-official',
                    option: options.clientOptions,
                });
                // const enforcer = await newEnforcer(options.model, options.adapter);
                const enforcer = await casbin_1.newEnforcer(options.casbinModelPath, adapter);
                await enforcer.loadPolicy();
                return enforcer;
            },
        };
        return {
            exports: [casbinEnforcerProvider, nest_casbin_service_1.NestCasbinService],
            module: NestCasbinCoreModule_1,
            providers: [casbinEnforcerProvider, nest_casbin_service_1.NestCasbinService],
        };
    }
    static forRootAsync(options) {
        const casbinEnforcerProvider = {
            provide: nest_casbin_constants_1.CASBIN_ENFORCER,
            useFactory: async (casbinOptions) => {
                const adapter = await casbin_mongodb_adapter_1.MongoAdapter.newAdapter({
                    uri: casbinOptions.uri,
                    collection: casbinOptions.collectionName || 'roles',
                    database: casbinOptions.databaseName || 'casbin-official',
                    option: casbinOptions.clientOptions,
                });
                const enforcer = await casbin_1.newEnforcer(casbinOptions.casbinModelPath, adapter);
                await enforcer.loadPolicy();
                return enforcer;
            },
            inject: [nest_casbin_constants_1.NEST_CASBIN_OPTION],
        };
        const asyncProviders = this.createAsyncProviders(options);
        return {
            module: NestCasbinCoreModule_1,
            imports: options.imports,
            providers: [
                ...asyncProviders,
                casbinEnforcerProvider,
                nest_casbin_service_1.NestCasbinService,
                {
                    provide: nest_casbin_constants_1.NEST_CASBIN_MODULE_ID,
                    useValue: exports.generateString(),
                },
            ],
            exports: [casbinEnforcerProvider, nest_casbin_service_1.NestCasbinService],
        };
    }
    // public static register(options: NestCasbinModuleOptions): DynamicModule {
    //   const casbinEnforcerProvider: Provider = {
    //     provide: CASBIN_ENFORCER,
    //     useFactory: async () => {
    //       const adapter = await MongoAdapter.newAdapter({
    //         uri: options.uri,
    //         collectionName: options.collectionName || 'casbin',
    //         databaseName: options.databaseName || 'node-casbin-official',
    //         option: options.clientOptions,
    //       });
    //       const enforcer = await newEnforcer(options.model, options.adapter);
    //       await enforcer.loadPolicy();
    //       return enforcer;
    //     },
    //   };
    //   return {
    //     exports: [casbinEnforcerProvider, NestCasbinService],
    //     module: NestCasbinCoreModule,
    //     providers: [casbinEnforcerProvider, NestCasbinService],
    //   };
    // }
    // public static registerAsync(options: NestCasbinModuleAsyncOptions): DynamicModule {
    //   const casbinEnforcerProvider: Provider = {
    //     provide: CASBIN_ENFORCER,
    //     useFactory: async (casbinOptions: NestCasbinModuleOptions) => {
    //       const enforcer = await newEnforcer(casbinOptions.model, casbinOptions.adapter);
    //       await enforcer.loadPolicy();
    //       return enforcer;
    //     },
    //     inject: [NEST_CASBIN_OPTION],
    //   };
    //
    //   const asyncProviders = this.createAsyncProviders(options);
    //   return {
    //     module: NestCasbinCoreModule,
    //     imports: options.imports,
    //     providers: [
    //       ...asyncProviders,
    //       casbinEnforcerProvider,
    //       NestCasbinService,
    //       {
    //         provide: NEST_CASBIN_MODULE_ID,
    //         useValue: generateString(),
    //       },
    //     ],
    //     exports: [casbinEnforcerProvider, NestCasbinService],
    //   };
    // }
    static createAsyncProviders(options) {
        if (options.useExisting || options.useFactory) {
            return [this.createAsyncOptionsProvider(options)];
        }
        const useClass = options.useClass;
        return [
            this.createAsyncOptionsProvider(options),
            {
                provide: useClass,
                useClass,
            },
        ];
    }
    static createAsyncOptionsProvider(options) {
        if (options.useFactory) {
            return {
                provide: nest_casbin_constants_1.NEST_CASBIN_OPTION,
                useFactory: options.useFactory,
                inject: options.inject || [],
            };
        }
        const inject = [
            (options.useClass || options.useExisting),
        ];
        return {
            provide: nest_casbin_constants_1.NEST_CASBIN_OPTION,
            useFactory: async (optionsFactory) => await optionsFactory.createCasbinOptions(),
            inject,
        };
    }
};
NestCasbinCoreModule = NestCasbinCoreModule_1 = __decorate([
    common_1.Global(),
    common_1.Module({
        providers: [nest_casbin_service_1.NestCasbinService],
        exports: [nest_casbin_service_1.NestCasbinService],
    })
], NestCasbinCoreModule);
exports.NestCasbinCoreModule = NestCasbinCoreModule;
//# sourceMappingURL=nest-casbin-core.module.js.map