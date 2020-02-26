"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var ObjectionModule_1;
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const Knex = require("knex");
const objection_1 = require("objection");
const objection_utils_1 = require("./objection.utils");
const objection_constants_1 = require("./objection.constants");
let ObjectionModule = ObjectionModule_1 = class ObjectionModule {
    static forRoot(options) {
        const BaseModel = options.Model || objection_1.Model;
        const connection = Knex(options.config);
        BaseModel.knex(connection);
        const objectionModuleOptions = {
            provide: objection_constants_1.OBJECTION_MODULE_OPTIONS,
            useValue: options,
        };
        const objectionBaseModelProvider = {
            provide: objection_constants_1.OBJECTION_BASE_MODULE,
            useValue: BaseModel,
        };
        const objectionConnectionProvider = {
            provide: objection_constants_1.OBJECTION_CONNECTION_NAME,
            useValue: connection,
        };
        return {
            module: ObjectionModule_1,
            providers: [
                objectionModuleOptions,
                objectionBaseModelProvider,
                objectionConnectionProvider,
            ],
            exports: [
                objectionModuleOptions,
                objectionBaseModelProvider,
                objectionConnectionProvider,
            ],
        };
    }
    static forFuture(models, connection) {
        const providers = (models || []).map(model => ({
            provide: objection_utils_1.getInjectToken(model, connection),
            useValue: model,
        }));
        return {
            module: ObjectionModule_1,
            providers: providers,
            exports: providers,
        };
    }
    static forRootAsync(options) {
        return {
            module: ObjectionModule_1,
            imports: [ObjectionModule_1.forRootAsync(options)],
        };
    }
};
ObjectionModule = ObjectionModule_1 = __decorate([
    common_1.Module({})
], ObjectionModule);
exports.ObjectionModule = ObjectionModule;
//# sourceMappingURL=objection.module.js.map