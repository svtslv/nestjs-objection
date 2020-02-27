import { Module, DynamicModule, Provider } from "@nestjs/common";
import * as Knex from "knex";
import { Model } from 'objection'
import { getInjectToken } from './objection.utils';
import {
  ObjectionModuleOptions,
  ObjectionModuleAsyncOptions
} from './objection.interfaces';
import { 
  OBJECTION_CONNECTION_NAME,
  OBJECTION_MODULE_OPTIONS, 
  OBJECTION_BASE_MODULE,
} from './objection.constants'

@Module({})
export class ObjectionModule {
  static forRoot(options: ObjectionModuleOptions): DynamicModule {

    const BaseModel = options.Model || Model;
    const connection = Knex(options.config);

    BaseModel.knex(connection);

    const objectionModuleOptions: Provider = {
      provide: OBJECTION_MODULE_OPTIONS,
      useValue: options,
    };

    const objectionBaseModelProvider: Provider = {
      provide: OBJECTION_BASE_MODULE,
      useValue: BaseModel,
    };

    const objectionConnectionProvider: Provider = {
      provide: OBJECTION_CONNECTION_NAME,
      useValue: connection,
    };

    return {
      module: ObjectionModule,
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

  static forFeature(models: any[], connection?: string): DynamicModule {
    const providers = (models || []).map(model => ({
      provide: getInjectToken(model, connection),
      useValue: model,
    }));
  
    return {
      module: ObjectionModule,
      providers: providers,
      exports: providers,
    };
  }

  static forRootAsync(options: ObjectionModuleAsyncOptions): DynamicModule {
    return {
      module: ObjectionModule,
      imports: [ObjectionModule.forRootAsync(options)],
    };
  }
}
