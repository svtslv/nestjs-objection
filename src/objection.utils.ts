import * as Knex from 'knex';
import { Model } from 'objection'
import { ObjectionModuleOptions, Connection } from "./objection.interfaces";
import {
  OBJECTION_MODULE_CONNECTION,
  OBJECTION_MODULE_CONNECTION_TOKEN,
  OBJECTION_MODULE_OPTIONS_TOKEN,
  OBJECTION_MODULE_BASE_MODEL_TOKEN,
} from './objection.constants';

export function getObjectionOptionsToken(connection: string): string {
  return `${ connection || OBJECTION_MODULE_CONNECTION }_${ OBJECTION_MODULE_OPTIONS_TOKEN }`;
}

export function getObjectionConnectionToken(connection: string): string {
  return `${ connection || OBJECTION_MODULE_CONNECTION }_${ OBJECTION_MODULE_CONNECTION_TOKEN }`;
}

export function getObjectionBaseModelToken(connection: string): any {
  return `${ connection || OBJECTION_MODULE_CONNECTION }_${ OBJECTION_MODULE_BASE_MODEL_TOKEN }`;
}

export function getObjectionModelToken(model: any, connection: string): string {
  return `${ connection || OBJECTION_MODULE_CONNECTION }_${ OBJECTION_MODULE_CONNECTION_TOKEN }_${ model.tableName || model.name }`;
}

export function createObjectionConnection(options: ObjectionModuleOptions): Connection {
  const { config } = options;
  const BaseModel = options.Model || Model;
  const knex = Knex(config);
  BaseModel.knex(knex);
  return knex;
}
