import { DynamicModule } from '@nestjs/common';
import { NestCasbinCoreModule } from './nest-casbin-core.module';
import { NestCasbinModuleAsyncOptions, NestCasbinModuleOptions } from './interfaces/nest-casbin.interface';
export declare class NestCasbinModule {
    static forRoot(options: NestCasbinModuleOptions): {
        module: typeof NestCasbinModule;
        imports: {
            exports: (typeof import("./nest-casbin.service").NestCasbinService | import("@nestjs/common").FactoryProvider<any>)[];
            module: typeof NestCasbinCoreModule;
            providers: (typeof import("./nest-casbin.service").NestCasbinService | import("@nestjs/common").FactoryProvider<any>)[];
        }[];
    };
    static forRootAsync(options: NestCasbinModuleAsyncOptions): {
        module: typeof NestCasbinModule;
        imports: {
            module: typeof NestCasbinCoreModule;
            imports: (import("@nestjs/common").Type<any> | DynamicModule | Promise<DynamicModule> | import("@nestjs/common").ForwardReference<any>)[];
            providers: (import("@nestjs/common").Type<any> | import("@nestjs/common").ClassProvider<any> | import("@nestjs/common").ValueProvider<any> | import("@nestjs/common").FactoryProvider<any> | import("@nestjs/common").ExistingProvider<any> | {
                provide: string;
                useFactory: (casbinOptions: any) => Promise<import("casbin").Enforcer>;
                inject: string[];
            })[];
            exports: (typeof import("./nest-casbin.service").NestCasbinService | {
                provide: string;
                useFactory: (casbinOptions: any) => Promise<import("casbin").Enforcer>;
                inject: string[];
            })[];
        }[];
    };
}
