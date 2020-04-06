# NestJS Objection

<a href="https://www.npmjs.com/package/nestjs-objection"><img src="https://img.shields.io/npm/v/nestjs-objection.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/package/nestjs-objection"><img src="https://img.shields.io/npm/dm/nestjs-objection.svg" alt="NPM Downloads" /></a>
<a href="https://www.npmjs.com/package/nestjs-objection"><img src="https://img.shields.io/npm/l/nestjs-objection.svg" alt="Package License" /></a>

## Table of Contents

- [Description](#description)
- [Installation](#installation)
- [Features](#features)
- [Examples](#examples)
- [Typescript](#typescript)
- [License](#license)

## Description
Integrates Objection.js and Knex with Nest

## Installation

```bash
$ npm install nestjs-objection knex objection
```

You can also use the interactive CLI

```sh
npx nestjs-modules
```

## Features

- Decorators      ```@InjectModel, @Table, @Column, @Relation ```
- Synchronization ```synchronize(model, force)```
- SoftDelete      ```@Table({ softDelete: boolean | string })```

#### Table options

| Name         | Type               | Required | Default           |
| ------------ | ------------------ | -------- | ----------------- |
| `tableName`  | `string`           | `true`   | `className`       |
| `softDelete` | `boolean / string` | `false`  | `false`           |
```+ Partial<typeof Model>```

#### Column options

| Name            | Type            | Required | Default           |
| --------------- | --------------- | -------- | ----------------- |
| `type`          | `columnTypes`   | `true`   | `---`             |
| `default`       | `any`           | `false`  | `---`             |
| `columnName`    | `string`        | `false`  | `false`           |
| `nullable`      | `boolean`       | `false`  | `false`           |
| `notNullable`   | `boolean`       | `false`  | `false`           |
| `unique`        | `boolean`       | `false`  | `false`           |
| `unsigned`      | `boolean`       | `false`  | `false`           |
| `increments`    | `boolean`       | `false`  | `false`           |
| `bigIncrements` | `boolean`       | `false`  | `false`           |
| `primary`       | `boolean`       | `false`  | `false`           |

#### synchronize(model, force?)

| Name            | Type            | Required | Default           |
| --------------- | --------------- | -------- | ----------------- |
| `model`         | `Model`         | `true`   | `---`             |
| `force`         | `boolean`       | `false`  | `false`           |

## Examples
```bash
$ npm install nestjs-objection knex objection sqlite3
```

### Models

```ts
// app.models.ts
import { 
  Model, 
  Column, 
  Relation, 
  Table, 
  relationTypes, 
  columnTypes, 
} from 'nestjs-objection';

@Table({ tableName: 'posts' })
export class Post extends Model {
  @Column({ type: columnTypes.string })
  title: string;

  @Column({ type: columnTypes.json })
  json: { [key: string]: any };

  @Column({ type: columnTypes.integer })
  userId: number;
}

@Table({ tableName: 'users' })
export class User extends Model {
  @Column({ type: columnTypes.string })
  name: string;

  @Relation({ 
    modelClass: Post, 
    relation: relationTypes.HasManyRelation, 
    join: { from: 'users.id', to: 'posts.userId' } 
  })
  posts: Post[];
}
```

### ObjectionModule.forRoot(options, connection?)

```ts
// app.module.ts
import { Module } from '@nestjs/common';
import { ObjectionModule, Model } from 'nestjs-objection'
import { AppController } from './app.controller';
import { User, Post } from './app.models';

@Module({
  imports: [
    ObjectionModule.forRoot({
      Model,
      config: {
        client: "sqlite3",
        useNullAsDefault: true,
        connection: ':memory:',
      }
    }),
    ObjectionModule.forFeature([User, Post]),
  ],
  controllers: [AppController],
})
export class AppModule {}
```

### ObjectionModule.forRootAsync(options, connection?)

```ts
// app.module.ts
import { Module } from '@nestjs/common';
import { ObjectionModule, Model } from 'nestjs-objection'
import { AppController } from './app.controller';
import { User, Post } from './app.models';

@Module({
  imports: [
    ObjectionModule.forRootAsync({
      useFactory: () => ({
        Model,
        config: {
          client: "sqlite3",
          useNullAsDefault: true,
          connection: ':memory:',
        },
      }),
    }),
    ObjectionModule.forFeature([User, Post]),
  ],
  controllers: [AppController],
})
export class AppModule {}
```

### InjectModel(Model, connection?)

```ts
// app.controller.ts
import { Controller, Get } from '@nestjs/common';
import { 
  InjectModel, 
  synchronize, 
  InjectConnection, 
  Connection, 
} from 'nestjs-objection';
import { User, Post } from './app.models';

@Controller()
export class AppController {
  constructor(
    @InjectModel(User) private readonly userModel: typeof User,
    @InjectModel(Post) private readonly postModel: typeof Post,
    @InjectConnection() private readonly connection: Connection,
  ) {}

  @Get()
  async getHello() {
    await synchronize(User);
    await synchronize(Post);
    await this.userModel.query().insert({ name: 'Name' });
    await this.postModel.query().insert({ title: 'Title', userId: 1 });

    const users = await this.userModel
      .query()
      .select(['users.name'])
      .withGraphJoined('posts')
      .modifyGraph('posts', q => q.select(['posts.title']));

    const posts = await this.connection.table('posts');

    return { users, posts };
  }
}
```

### SoftDeleteModel

```ts
import { SoftDeleteModel } from 'nestjs-objection';

@Table({ tableName: 'users', softDelete: true })
export class User extends SoftDeleteModel {
  @Column({ type: columnTypes.integer, increments: true })
  id: number;
  @Column({ type: columnTypes.datetime })
  deletedAt: Date;
}
```

```ts
ObjectionModule.forRoot({
  Model: SoftDeleteModel,
  config: { /* ... */ }
})
```

```ts
this.userModel.query().where({ id: 1 }).delete(); // softDelete
this.userModel.query().where({ id: 1 }).includeDeleted();
this.userModel.query().where({ id: 1 }).forceDelete();
```

## Typescript

```ts
// src/index.d.ts
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
    includeDeleted(): this;
    forceDelete(): this;
  }
}
```

```ts
// with type-safe
const users = await this.userModel
  .query()
  .select<User>(['name'])
  .where<User>({ name: 'Name' })
  .orderBy<User>('name', 'desc')
  .withGraphFetched('posts')
  .modifyGraph('posts', q => q.select<Post>(['title']));

// without type-safe
const users = await this.userModel
  .query()
  .select(['name'])
  .where({ name: 'Name' })
  .orderBy('name', 'desc')
  .withGraphFetched('posts')
  .modifyGraph('posts', q => q.select(['title']));
```

## License

MIT
