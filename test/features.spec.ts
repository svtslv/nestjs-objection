import { Table, Column, columnTypes, synchronize, knex, SoftDeleteModel } from '../src';

// const SoftDelete = softDelete()(Model)

@Table({ tableName: 'User', softDelete: true })
class User extends SoftDeleteModel {
  @Column({ type: columnTypes.bigInteger, increments: true })
  id2: number;
  @Column({ type: columnTypes.number, default: 30 })
  age: number;
  @Column({ type: columnTypes.string })
  name: string;
  @Column({ type: columnTypes.object })
  json: object;
  @Column({ type: columnTypes.datetime })
  deletedAt: object;
}

describe('ObjectionFeatures', () => {
  test('should return one user', async () => {
    const connection = knex({ client: 'sqlite3', connection: ':memory:', useNullAsDefault: true });
    // const connection = knex({ client: 'pg', connection: 'postgres://postgres:password@127.0.0.1:5432/postgres' });

    // connection.on('query', query => console.log('Knex Query', { 
    //   date: new Date(), 
    //   sql: query.sql, 
    //   bindings: query.bindings 
    // }));
    
    SoftDeleteModel.knex(connection);
    await synchronize(User, true);

    const user = new User();
    user.name = 'John';
    // user.age = 30;
    await user.$query().insert();
    await user.$query().patch();
    await user.$query().delete();

    const result = await User.query().includeDeleted().select<User>(['age', 'name']);

    expect(result.length).toEqual(1);
    await connection.destroy();
  });
});