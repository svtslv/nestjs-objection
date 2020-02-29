import { Model } from 'objection';
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

export function getObjectionModelToken(model, connection: string): string {
  return `${ connection || OBJECTION_MODULE_CONNECTION }_${ OBJECTION_MODULE_CONNECTION_TOKEN }_${ model.name }`;
}

export async function synchronize(model: typeof Model, force?: boolean) {
  const tableName = model.tableName;

  if(force) {
    await model.knex().schema.dropTable(tableName)
  }

  if(!await model.knex().schema.hasTable(tableName)) {
    await model.knex().schema.createTable(tableName, table => {
      table.increments('id').primary();
    })
  }

  const properties = model.jsonSchema?.properties || {};

  for(const item of Object.keys(properties)) {
    const columnName = item;
    const columnType = properties[item]['key'];
    if (await model.knex().schema.hasColumn(tableName, columnName)) {
      return null;
    }
    await model.knex().schema.table(tableName, table => {
      table[columnType](columnName);
    });
  }
}
