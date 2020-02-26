import { Model, QueryBuilder } from 'objection';
export { Model, QueryBuilder };
export declare function InjectModel(model: any, connection?: string): (target: object, key: string | symbol, index?: number) => void;
export declare function Table(options: {
    tableName: string;
    [key: string]: any;
}): (target: any) => void;
export declare const columnTypes: {
    readonly integer: "integer";
    readonly string: "string";
    readonly number: "number";
    readonly object: "object";
};
export declare function Column(options?: {
    type: typeof columnTypes[keyof typeof columnTypes];
}): (target: any, propertyKey: string) => void;
export declare const relationTypes: {
    readonly HasManyRelation: import("objection").RelationType;
    readonly HasOneRelation: import("objection").RelationType;
    readonly HasOneThroughRelation: import("objection").RelationType;
    readonly BelongsToOneRelation: import("objection").RelationType;
};
export declare function Relation(relationMapping: {
    modelClass: any;
    relation: typeof relationTypes[keyof typeof relationTypes];
    join: {
        from: string;
        to: string;
    };
}): (target: any, propertyKey: string) => void;
