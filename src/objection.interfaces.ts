// noinspection JSUnusedGlobalSymbols

import { Type } from '@nestjs/common';
import { ModuleMetadata } from '@nestjs/common/interfaces';
import * as knex from 'knex';
import { Model } from 'objection';

export type Knex = knex.Knex;
export type Connection = knex.Knex;

export interface ObjectionModuleOptions {
  Model?: typeof Model;
  config: knex.Knex.Config;
}

export interface ObjectionModuleOptionsFactory {
  createObjectionModuleOptions(): Promise<ObjectionModuleOptions> | ObjectionModuleOptions;
}

export interface ObjectionModuleAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
  inject?: any[];
  useClass?: Type<ObjectionModuleOptionsFactory>;
  useExisting?: Type<ObjectionModuleOptionsFactory>;
  useFactory?: (...args: any[]) => Promise<ObjectionModuleOptions> | ObjectionModuleOptions;
}
