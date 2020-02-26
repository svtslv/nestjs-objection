import { Inject } from '@nestjs/common';
import { Model, QueryBuilder } from 'objection';
import { getInjectToken } from './objection.utils';
export { Model, QueryBuilder };

// InjectModel
export function InjectModel(model: any, connection?: string) {
  return Inject(getInjectToken(model, connection))
}

// Table
export function Table(options: { tableName: string, [key: string]: any }) {
  return function (target: any) {
    target.tableName = target.name;
    Object.keys(options).forEach(item => {
      target[item] = options[item]
    })
  }
}

// Column
export const columnTypes = {
  integer: 'integer',
  string: 'string',
  number: 'number',
  object: 'object'
} as const;

export function Column(options?: { type: typeof columnTypes[keyof typeof columnTypes] }) {
  return function(target: any, propertyKey: string) {
    if (options && options.type) {
      target.constructor.jsonSchema = target.constructor.jsonSchema || {};
      target.constructor.jsonSchema.properties = target.constructor.jsonSchema.properties || {};
      target.constructor.jsonSchema.properties[propertyKey] = { type: options.type }
    }
  }
}

// Relation
export const relationTypes = {
  HasManyRelation: Model.HasManyRelation,
  HasOneRelation: Model.HasOneRelation,
  HasOneThroughRelation: Model.HasOneThroughRelation,
  BelongsToOneRelation: Model.BelongsToOneRelation,
} as const;

export function Relation(relationMapping: { modelClass: any, relation: typeof relationTypes[keyof typeof relationTypes], join: { from: string, to: string} }) {
  return function(target: any, propertyKey: string) {
    target.constructor.relationMappings = target.constructor.relationMappings || {};
    target.constructor.relationMappings[propertyKey] = relationMapping
  }
}
