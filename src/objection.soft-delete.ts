import { Model as ObjectionModel } from 'objection';
export type { AnyQueryBuilder } from 'objection';

declare module 'objection' {
  interface WhereMethod<QB extends AnyQueryBuilder> {
    <T>(columns: Partial<T>): QB;
    <T>(column: Partial<keyof T>, op: string, value: any): QB;
  }
  interface OrderByMethod<QB extends AnyQueryBuilder> {
    <T>(column: keyof T, order?: 'asc' | 'desc'): QB;
    <T>(columns: (Array<{ column: keyof T; order?: 'asc' | 'desc' }>)): QB;
  }
  interface SelectMethod<QB extends AnyQueryBuilder> {
    <T>(...columnNames: Array<Partial<keyof T>>): QB;
    <T>(columnNames: Array<Partial<keyof T>>): QB;
  }
  interface QueryBuilder<M extends ObjectionModel, R = M[]> extends Promise<R> {
    includeDeleted(): this;
    forceDelete(): this;
  }
}

export const softDelete = () => {
  return (Model: any): typeof ObjectionModel => {

    class SoftDeleteQueryBuilder extends Model.QueryBuilder {
      softDeleteColumnName: string;

      constructor(modelClass: any) {
        super(modelClass)

        if (modelClass.softDelete) {
          this.softDeleteColumnName = typeof modelClass.softDelete === 'string' ? modelClass.softDelete : 'deletedAt'
        }

        if (modelClass.softDelete) {
          this.onBuild((q: any) => {
            if (q.isFind() && !q.context().includeDeleted) {
              q.whereNull(`${q.tableRefFor(modelClass)}.${this.softDeleteColumnName}`);
            }
          });
        }
      }

      includeDeleted() {
        return this.context({ includeDeleted: true });
      }

      delete(...args: any) {
        if (this.modelClass().softDelete) {
          return super.patch({ [this.softDeleteColumnName]: new Date() });
        }

        return super.delete(...args);
      }

      forceDelete(...args: any) {
        return super.delete(...args);
      }
    }

    class SDModel extends Model {
      static get QueryBuilder() {
        return SoftDeleteQueryBuilder;
      }

      static get isSoftDelete() {
        return true;
      }
    };

    return SDModel as any;
  }
};

export const SoftDeleteModel = softDelete()(ObjectionModel);
