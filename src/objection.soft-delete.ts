import { Model } from 'objection';
export type { AnyQueryBuilder, Model } from 'objection';

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
  interface QueryBuilder<M extends Model, R = M[]> extends Promise<R> {
    forceDelete(): this;
    withDeleted(): this;
    onlyDeleted(): this;
    softDelete(): this;
    restore(): this;
  }
}

export const softDelete = () => {
  return (IncomingModel: any): typeof Model => {

    class SoftDeleteQueryBuilder extends IncomingModel.QueryBuilder {
      softDeleteColumnName: string;

      constructor(modelClass: any) {
        super(modelClass)

        if (modelClass.softDelete) {
          this.softDeleteColumnName = typeof modelClass.softDelete === 'string' ? modelClass.softDelete : 'deletedAt'

          this.onBuild((q: any) => {
            if (q.isFind() && !q.context().includeDeleted) {
              q.whereNull(`${q.tableRefFor(modelClass)}.${this.softDeleteColumnName}`);
            }
          });
        }
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

      withDeleted() {
        return this.context({ includeDeleted: true });
      }

      onlyDeleted() {
        return this.withDeleted().whereNotNull(this.softDeleteColumnName);
      }

      softDelete() {
        if (this.modelClass().softDelete) {
          return super.patch({ [this.softDeleteColumnName]: new Date() });
        }
      }

      restore() {
        if (this.modelClass().softDelete) {
          return super.patch({ [this.softDeleteColumnName]: null });
        }
      }
    }

    class SDModel extends IncomingModel {
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

export class SoftDeleteModel extends softDelete()(Model) {};
