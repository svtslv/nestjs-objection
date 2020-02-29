import { Module, DynamicModule, Provider } from "@nestjs/common";
import * as Knex from "knex";
import { Model } from 'objection'
import {
  getObjectionModelToken,
  getObjectionConnectionToken,
  getObjectionOptionsToken,
  getObjectionBaseModelToken,
} from './objection.utils';
import {
  ObjectionModuleOptions,
  ObjectionModuleAsyncOptions
} from './objection.interfaces';

@Module({})
export class ObjectionModule {
  static forRoot(options: ObjectionModuleOptions, connection?: string): DynamicModule {

    const BaseModel = options.Model || Model;
    const knex = Knex(options.config);
    BaseModel.knex(knex);

    const objectionOptionsProvider: Provider = {
      provide: getObjectionOptionsToken(connection),
      useValue: options,
    };

    const objectionBaseModelProvider: Provider = {
      provide: getObjectionBaseModelToken(connection),
      useValue: BaseModel,
    };

    const objectionConnectionProvider: Provider = {
      provide: getObjectionConnectionToken(connection),
      useValue: knex,
    };

    return {
      module: ObjectionModule,
      providers: [
        objectionOptionsProvider,
        objectionBaseModelProvider,
        objectionConnectionProvider,
      ],
      exports: [
        objectionOptionsProvider,
        objectionBaseModelProvider,
        objectionConnectionProvider,
      ],
    };
  }

  static forFeature(models: any[], connection?: string): DynamicModule {
    const providers = (models || []).map(model => ({
      provide: getObjectionModelToken(model, connection),
      useValue: model,
    }));
  
    return {
      module: ObjectionModule,
      providers: providers,
      exports: providers,
    };
  }

  static forRootAsync(options: ObjectionModuleAsyncOptions, connection?: string): DynamicModule {
    return {
      module: ObjectionModule,
      imports: [ObjectionModule.forRootAsync(options, connection)],
    };
  }
}
