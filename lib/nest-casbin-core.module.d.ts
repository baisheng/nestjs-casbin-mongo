import { DynamicModule, Type } from '@nestjs/common';
import { NestCasbinService } from './nest-casbin.service';
import { NestCasbinModuleAsyncOptions, NestCasbinModuleOptions } from './interfaces/nest-casbin.interface';
export declare const generateString: () => any;
export declare class NestCasbinCoreModule {
    static forRoot(options: NestCasbinModuleOptions): {
        exports: (typeof NestCasbinService | import("@nestjs/common").FactoryProvider<any>)[];
        module: typeof NestCasbinCoreModule;
        providers: (typeof NestCasbinService | import("@nestjs/common").FactoryProvider<any>)[];
    };
    static forRootAsync(options: NestCasbinModuleAsyncOptions): {
        module: typeof NestCasbinCoreModule;
        imports: (Type<any> | DynamicModule | Promise<DynamicModule> | import("@nestjs/common").ForwardReference<any>)[];
        providers: (Type<any> | import("@nestjs/common").ClassProvider<any> | import("@nestjs/common").ValueProvider<any> | import("@nestjs/common").FactoryProvider<any> | import("@nestjs/common").ExistingProvider<any> | {
            provide: string;
            useFactory: (casbinOptions: any) => Promise<import("casbin").Enforcer>;
            inject: string[];
        })[];
        exports: (typeof NestCasbinService | {
            provide: string;
            useFactory: (casbinOptions: any) => Promise<import("casbin").Enforcer>;
            inject: string[];
        })[];
    };
    private static createAsyncProviders;
    private static createAsyncOptionsProvider;
}
