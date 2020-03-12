import { DynamicModule, Module } from '@nestjs/common';
import { ObjectionCoreModule } from './objection.core-module';
import { ObjectionModuleAsyncOptions, ObjectionModuleOptions } from './objection.interfaces';
import { getObjectionModelToken } from './objection.utils';

@Module({})
export class ObjectionModule {
  public static forRoot(options: ObjectionModuleOptions, connection?: string): DynamicModule {
    return {
      module: ObjectionModule,
      imports: [ObjectionCoreModule.forRoot(options, connection)],
      exports: [ObjectionCoreModule],
    };
  }

  public static forRootAsync(options: ObjectionModuleAsyncOptions, connection?: string): DynamicModule {
    return {
      module: ObjectionModule,
      imports: [ObjectionCoreModule.forRootAsync(options, connection)],
      exports: [ObjectionCoreModule],
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
}
