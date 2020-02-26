"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const objection_1 = require("objection");
exports.Model = objection_1.Model;
exports.QueryBuilder = objection_1.QueryBuilder;
const objection_utils_1 = require("./objection.utils");
function InjectModel(model, connection) {
    return common_1.Inject(objection_utils_1.getInjectToken(model, connection));
}
exports.InjectModel = InjectModel;
function Table(options) {
    return function (target) {
        target.tableName = target.name;
        Object.keys(options).forEach(item => {
            target[item] = options[item];
        });
    };
}
exports.Table = Table;
exports.columnTypes = {
    integer: 'integer',
    string: 'string',
    number: 'number',
    object: 'object'
};
function Column(options) {
    return function (target, propertyKey) {
        if (options && options.type) {
            target.constructor.jsonSchema = target.constructor.jsonSchema || {};
            target.constructor.jsonSchema.properties = target.constructor.jsonSchema.properties || {};
            target.constructor.jsonSchema.properties[propertyKey] = { type: options.type };
        }
    };
}
exports.Column = Column;
exports.relationTypes = {
    HasManyRelation: objection_1.Model.HasManyRelation,
    HasOneRelation: objection_1.Model.HasOneRelation,
    HasOneThroughRelation: objection_1.Model.HasOneThroughRelation,
    BelongsToOneRelation: objection_1.Model.BelongsToOneRelation,
};
function Relation(relationMapping) {
    return function (target, propertyKey) {
        target.constructor.relationMappings = target.constructor.relationMappings || {};
        target.constructor.relationMappings[propertyKey] = relationMapping;
    };
}
exports.Relation = Relation;
//# sourceMappingURL=objection.core.js.map