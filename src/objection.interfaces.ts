import { Type } from "@nestjs/common";
import { ModuleMetadata } from "@nestjs/common/interfaces";
import * as knex from 'knex';
import { Model } from "objection";

export type Knex = knex;
export type Connection = Knex;

export interface ObjectionModuleOptions {
  Model?: typeof Model;
  config: knex.Config;
}

export interface ObjectionModuleOptionsFactory {
  createObjectionModuleOptions(): Promise<ObjectionModuleOptions> | ObjectionModuleOptions;
}

export interface ObjectionModuleAsyncOptions extends Pick<ModuleMetadata, "imports"> {
  inject?: any[];
  useClass?: Type<ObjectionModuleOptionsFactory>;
  useExisting?: Type<ObjectionModuleOptionsFactory>;
  useFactory?: (...args: any[]) => Promise<ObjectionModuleOptions> | ObjectionModuleOptions;
}
