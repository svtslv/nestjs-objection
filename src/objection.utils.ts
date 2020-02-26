import { Model } from 'objection';
import {
  OBJECTION_CONNECTION_NAME,
  OBJECTION_MODULE_ID
} from './objection.constants';

export const getInjectToken = (model, connection) => {
  connection = connection || OBJECTION_CONNECTION_NAME;
  return `${connection}_${OBJECTION_MODULE_ID}_${model.name}`
};

export const synchronize = async (model: typeof Model, force?: boolean) => {
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
};
