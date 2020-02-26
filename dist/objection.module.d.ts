import { DynamicModule } from "@nestjs/common";
import { ObjectionModuleOptions, ObjectionModuleAsyncOptions } from './objection.interfaces';
export declare class ObjectionModule {
    static forRoot(options: ObjectionModuleOptions): DynamicModule;
    static forFuture(models: any[], connection?: string): DynamicModule;
    static forRootAsync(options: ObjectionModuleAsyncOptions): DynamicModule;
}
