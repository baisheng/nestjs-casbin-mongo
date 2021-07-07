import { ModuleMetadata } from '@nestjs/common/interfaces';
import { Type } from '@nestjs/common';
import { Adapter, Model } from 'casbin';
import { MongoClientOptions } from 'mongodb';
export interface NestCasbinModuleOptions {
    uri: string;
    casbinModelPath: string;
    databaseName: string;
    collectionName: string;
    clientOptions?: MongoClientOptions;
    adapter: Type<Adapter> | any;
    model: string | Model;
}
export interface NestCasbinOptionsFactory {
    createCasbinOptions(connectionName?: string): Promise<NestCasbinModuleOptions> | NestCasbinModuleOptions;
    createCasbinOptions(): Promise<NestCasbinModuleOptions> | NestCasbinModuleOptions;
}
export interface NestCasbinModuleAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
    useExisting?: Type<NestCasbinOptionsFactory>;
    useClass?: Type<NestCasbinOptionsFactory>;
    useFactory?: (...args: any[]) => Promise<NestCasbinModuleOptions> | NestCasbinModuleOptions;
    inject?: any[];
}
