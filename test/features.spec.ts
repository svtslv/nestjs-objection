import { Table, Column, columnTypes, synchronize, knex, SoftDeleteModel, Modifier } from '../src';

// const SoftDelete = softDelete()(Model)

@Table({ tableName: 'User', softDelete: true })
class User extends SoftDeleteModel {

  // static modifiers = {
  //   defaultSelects(query) {
  //     query.select('id2', 'age');
  //   }
  // };

  // variant 1
  @Modifier()
  static defaultSelects(query) {
    query.select('id2', 'age');
  }

  // variant 2
  @Modifier(query => query.orderBy('id2', 'asc'))
  static defaultOrderBy: Function;
  // static defaultLimit() {
  //   return null;
  // };

  @Column({ type: columnTypes.increments })
  id2: number;
  @Column({ type: columnTypes.number, default: 30 })
  age: number;
  @Column({ type: columnTypes.string, length: 20 })
  name: string;
  @Column({ type: columnTypes.object })
  json: object;
  @Column({ type: columnTypes.datetime })
  deletedAt: object;
}

describe('ObjectionFeatures', () => {
  test('should return two users', async () => {
    const connection = knex({ client: 'sqlite3', connection: { filename: 'test/sqlite.db' }, useNullAsDefault: true });
    // const connection = knex({ client: 'sqlite3', connection: ':memory:', useNullAsDefault: true });
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
    await user.$query().delete();
    console.log(user);

    const user2 = new User();
    user2.name = 'Mike';
    user2.age = 35;
    await user2.$query().insert();
    console.log(user2);

    const withDeleted = await User.query().withDeleted();
    const onlyDeleted = await User.query().onlyDeleted();
    await User.query().where<User>({ id2: 1 }).restore();
    const users = await User.query().modify('defaultSelects').modify('defaultOrderBy');
    console.log('withDeleted', withDeleted);
    console.log('onlyDeleted', onlyDeleted);
    console.log('users', users);

    expect(withDeleted.length).toEqual(2);
    expect(onlyDeleted.length).toEqual(1);
    expect(users.length).toEqual(2);
    await connection.destroy();
  });
});