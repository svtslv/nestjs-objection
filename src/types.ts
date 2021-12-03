// noinspection JSUnusedGlobalSymbols

export { AnyQueryBuilder, Model } from 'objection';

declare module 'objection' {
  interface WhereMethod<QB extends AnyQueryBuilder> {
    <T>(columns: Partial<T>): QB;
    <T>(column: Partial<keyof T>, op: string, value: any): QB;
  }
  interface OrderByMethod<QB extends AnyQueryBuilder> {
    <T>(column: keyof T, order?: 'asc' | 'desc'): QB;
    <T>(columns: Array<{ column: keyof T; order?: 'asc' | 'desc' }>): QB;
  }
  interface SelectMethod<QB extends AnyQueryBuilder> {
    <T>(...columnNames: Array<Partial<keyof T>>): QB;
    <T>(columnNames: Array<Partial<keyof T>>): QB;
  }
  interface WhereNullMethod<QB extends AnyQueryBuilder> {
    <T>(column: Partial<keyof T>): QB;
  }
  interface QueryBuilder<M extends Model, R = M[]> extends Promise<R> {
    forceDelete(): this;
    withDeleted(): this;
    onlyDeleted(): this;
    softDelete(): this;
    restore(): this;
  }
}
