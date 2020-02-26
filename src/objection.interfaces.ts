import { Type } from "@nestjs/common";
import { ModuleMetadata } from "@nestjs/common/interfaces";
import * as Knex from 'knex';
import { Model } from "objection";

export interface ObjectionModuleOptions {
  Model?: typeof Model;
  config: Knex.Config;
}

export interface ObjectionModuleOptionsFactory {
  createObjectionModuleOptions():
    | Promise<ObjectionModuleOptions>
    | ObjectionModuleOptions;
}

export interface ObjectionModuleAsyncOptions
  extends Pick<ModuleMetadata, "imports"> {
  useExisting?: Type<ObjectionModuleOptionsFactory>;
  useClass?: Type<ObjectionModuleOptionsFactory>;
  inject?: any[];
  useFactory?(
    ...args: any[]
  ): Promise<ObjectionModuleOptions> | ObjectionModuleOptions;
}

export type Connection = Knex;
