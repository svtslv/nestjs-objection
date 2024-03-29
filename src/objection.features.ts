// noinspection JSUnusedGlobalSymbols

import { Model, QueryBuilder, AnyQueryBuilder, AjvValidator } from 'objection';
import * as knex from 'knex';

export { knex };
export { Model, QueryBuilder, AnyQueryBuilder };

/* Table */
export function Table(options: Partial<typeof Model> & { softDelete?: boolean | string }) {
  return function (target: any) {
    target.tableName = target.name;
    Object.keys(options).forEach((item) => {
      target[item] = options[item];
    });
    if (options.createValidator) {
      target.createValidator = options.createValidator;
    } else {
      target.createValidator = () => {
        return new AjvValidator({
          onCreateAjv: () => null,
          options: { strict: false },
        });
      };
    }
  };
}

/* Modifier */
export function Modifier(modifier?: (query: AnyQueryBuilder, ...props: any) => any): any {
  return function (target: any, propertyKey: string, descriptor: any) {
    const modifiers = { [propertyKey]: modifier || descriptor?.value };

    target.modifiers = target.modifiers || {};
    target.modifiers = { ...target.modifiers, ...modifiers };

    target.constructor.modifiers = target.constructor.modifiers || {};
    target.constructor.modifiers = { ...target.constructor.modifiers, ...modifiers };
  };
}

/* Column */
const allTypes = {
  number: 'number',
  string: 'string',
  boolean: 'boolean',
  object: 'object',
  array: 'array',
  null: 'null',
};

const anyType = Object.values(allTypes).map((item) => item);

export const columnTypes = {
  /* knex */
  increments: { columnType: 'increments', type: [allTypes.number, allTypes.null] },
  bigIncrements: { columnType: 'bigIncrements', type: [allTypes.number, allTypes.null] },
  integer: { columnType: 'integer', type: [allTypes.number, allTypes.null] },
  bigInteger: { columnType: 'bigInteger', type: [allTypes.number, allTypes.null] },
  text: { columnType: 'text', type: [allTypes.string, allTypes.null] },
  string: { columnType: 'string', type: [allTypes.string, allTypes.null] },
  float: { columnType: 'float', type: anyType },
  decimal: { columnType: 'decimal', type: anyType },
  boolean: { columnType: 'boolean', type: [allTypes.boolean] },
  date: { columnType: 'date', type: anyType },
  datetime: { columnType: 'datetime', type: anyType },
  time: { columnType: 'time', type: anyType },
  timestamp: { columnType: 'timestamp', type: anyType },
  timestamps: { columnType: 'timestamps', type: anyType },
  binary: { columnType: 'binary', type: anyType },
  json: { columnType: 'json', type: [allTypes.object] },
  jsonb: { columnType: 'jsonb', type: [allTypes.object] },
  uuid: { columnType: 'uuid', type: anyType },
  /* custom */
  number: { columnType: 'integer', type: [allTypes.number, allTypes.null] },
  object: { columnType: 'json', type: [allTypes.object] },
  /* other */
  // default: { columnType: 'default', type: anyType },
  // nullable: { columnType: 'nullable', type: anyType },
  // notNullable: { columnType: 'notNullable', type: anyType },
  // primary: { columnType: 'primary', type: anyType },
  // unique: { columnType: 'unique', type: anyType },
  // enu: { columnType: 'enu', type: anyType },
  // comment: { columnType: 'comment', type: anyType },
  // engine: { columnType: 'engine', type: anyType },
  // charset: { columnType: 'charset', type: anyType },
  // collate: { columnType: 'collate', type: anyType },
  // inherits: { columnType: 'inherits', type: anyType },
};

// const DataType = Object.keys(columnTypes).reduce(
//   (acc, item) => { acc[item] = item; return acc; },
//   {} as { [key in keyof typeof columnTypes]: keyof typeof columnTypes
// });

type ColumnOptions = {
  type: typeof columnTypes[keyof typeof columnTypes];
  columnName?: string;
  default?: any;
  nullable?: boolean;
  notNullable?: boolean;
  unique?: boolean;
  unsigned?: boolean;
  primary?: boolean;
  length?: number;
};

export function Column(options?: ColumnOptions) {
  return function (target: any, propertyKey: string) {
    const columnName = options.columnName || propertyKey;
    if (
      options?.type?.columnType === 'increments' ||
      options?.type?.columnType === 'bigIncrements' ||
      options?.primary
    ) {
      target.constructor.idColumn = columnName;
    }

    target.constructor._columnOptions = target.constructor._columnOptions || {};
    target.constructor._columnOptions[propertyKey] = { ...options, columnName } || {};

    if (options && options.type) {
      target.constructor.jsonSchema = target.constructor.jsonSchema || {};
      target.constructor.jsonSchema.properties = target.constructor.jsonSchema.properties || {};
      target.constructor.jsonSchema.properties[propertyKey] = { type: options.type.type };
    }
  };
}

/* Relation */
export const relationTypes = {
  HasManyRelation: Model.HasManyRelation,
  HasOneRelation: Model.HasOneRelation,
  HasOneThroughRelation: Model.HasOneThroughRelation,
  BelongsToOneRelation: Model.BelongsToOneRelation,
} as const;

export function Relation(relationMapping: any) {
  return function (target: any, propertyKey: string) {
    target.constructor.relationMappings = target.constructor.relationMappings || {};
    target.constructor.relationMappings[propertyKey] = relationMapping;
  };
}

/* synchronize */
export async function synchronize(model: any, force?: boolean) {
  const tableName = model.tableName;

  if (force && (await model.knex().schema.hasTable(tableName))) {
    await model.knex().schema.dropTable(tableName);
  }

  const properties = model['_columnOptions'] as { [key: string]: ColumnOptions };

  if (!(await model.knex().schema.hasTable(tableName))) {
    await model.knex().schema.createTable(tableName, (table) => {
      const increments = Object.values(properties).filter((item) => item.type?.columnType === 'increments')[0];
      const bigIncrements = Object.values(properties).filter((item) => item.type?.columnType === 'bigIncrements')[0];
      const primary = Object.values(properties).filter((item) => item.primary)[0];
      if (increments) {
        table.increments(increments.columnName).primary();
      } else if (bigIncrements) {
        table.bigIncrements(bigIncrements.columnName).primary();
      } else if (primary) {
        table[primary.type.columnType](primary.columnName);
      } else {
        table.increments('id').primary();
      }
    });
  }

  for (const item of Object.keys(properties)) {
    const {
      type: { columnType },
      columnName,
      ...options
    } = properties[item];

    if (!(await model.knex().schema.hasColumn(tableName, columnName))) {
      await model.knex().schema.table(tableName, (table) => {
        // create column
        if (options.length) {
          table[columnType](columnName, options.length);
        } else {
          table[columnType](columnName);
        }

        // alter column
        const client = model.knex().client?.config?.client;
        if (client === 'pg' || client === 'mysql' || client === 'mysql2') {
          if (options.default) {
            table[columnType](columnName).default(options.default).alter();
          }
          if (options.unique) {
            table[columnType](columnName).unique().alter();
          }
          if (options.unsigned) {
            table[columnType](columnName).unsigned().alter();
          }
          if (options.nullable) {
            table[columnType](columnName).nullable().alter();
          }
          if (options.notNullable) {
            table[columnType](columnName).notNullable().alter();
          }
        }
      });
    }
  }
}
