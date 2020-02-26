"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const objection_constants_1 = require("./objection.constants");
exports.getInjectToken = (model, connection) => {
    connection = connection || objection_constants_1.OBJECTION_CONNECTION_NAME;
    return `${connection}_${objection_constants_1.OBJECTION_MODULE_ID}_${model.name}`;
};
//# sourceMappingURL=objection.utils.js.map