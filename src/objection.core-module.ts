import { Global, Module, DynamicModule, Provider } from '@nestjs/common';
import {
  ObjectionModuleAsyncOptions,
  ObjectionModuleOptions,
  ObjectionModuleOptionsFactory,
} from './objection.interfaces';
import { createObjectionConnection, getObjectionOptionsToken, getObjectionConnectionToken } from './objection.utils';

@Global()
@Module({})
export class ObjectionCoreModule {
  /* forRoot */
  static forRoot(options: ObjectionModuleOptions, connection?: string): DynamicModule {
    const objectionOptionsProvider: Provider = {
      provide: getObjectionOptionsToken(connection),
      useValue: options,
    };

    const objectionConnectionProvider: Provider = {
      provide: getObjectionConnectionToken(connection),
      useValue: createObjectionConnection(options),
    };

    return {
      module: ObjectionCoreModule,
      providers: [objectionOptionsProvider, objectionConnectionProvider],
      exports: [objectionOptionsProvider, objectionConnectionProvider],
    };
  }

  /* forRootAsync */
  public static forRootAsync(options: ObjectionModuleAsyncOptions, connection: string): DynamicModule {
    const objectionConnectionProvider: Provider = {
      provide: getObjectionConnectionToken(connection),
      useFactory(options: ObjectionModuleOptions) {
        return createObjectionConnection(options);
      },
      inject: [getObjectionOptionsToken(connection)],
    };

    return {
      module: ObjectionCoreModule,
      imports: options.imports,
      providers: [...this.createAsyncProviders(options, connection), objectionConnectionProvider],
      exports: [objectionConnectionProvider],
    };
  }

  /* createAsyncProviders */
  public static createAsyncProviders(options: ObjectionModuleAsyncOptions, connection?: string): Provider[] {
    if (!(options.useExisting || options.useFactory || options.useClass)) {
      throw new Error('Invalid configuration. Must provide useFactory, useClass or useExisting');
    }

    if (options.useExisting || options.useFactory) {
      return [this.createAsyncOptionsProvider(options, connection)];
    }

    return [
      this.createAsyncOptionsProvider(options, connection),
      { provide: options.useClass, useClass: options.useClass },
    ];
  }

  /* createAsyncOptionsProvider */
  public static createAsyncOptionsProvider(options: ObjectionModuleAsyncOptions, connection?: string): Provider {
    if (!(options.useExisting || options.useFactory || options.useClass)) {
      throw new Error('Invalid configuration. Must provide useFactory, useClass or useExisting');
    }

    if (options.useFactory) {
      return {
        provide: getObjectionOptionsToken(connection),
        useFactory: options.useFactory,
        inject: options.inject || [],
      };
    }

    return {
      provide: getObjectionOptionsToken(connection),
      async useFactory(optionsFactory: ObjectionModuleOptionsFactory): Promise<ObjectionModuleOptions> {
        return optionsFactory.createObjectionModuleOptions();
      },
      inject: [options.useClass || options.useExisting],
    };
  }
}
