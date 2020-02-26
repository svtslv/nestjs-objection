# NestJS Objection

## Table of Contents

- [Description](#description)
- [Installation](#installation)
- [Examples](#examples)
- [License](#license)

## Description
Integrates Objection.js and Knex with Nest

## Installation

```bash
$ npm install nestjs-objection
```

## Examples
```bash
$ npm install nestjs-objection sqlite3
```

```ts
// app.models.ts
import { Column, Relation, Table, relationTypes, columnTypes, Model } from 'nestjs-objection';

@Table({ tableName: 'posts' })
export class Post extends Model {
  @Column({ type: columnTypes.string })
  title: string;

  @Column({ type: columnTypes.object })
  json: { [key: string]: any };

  @Column({ type: columnTypes.number })
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
    ObjectionModule.forFuture([User, Post]),
  ],
  controllers: [AppController],
})
export class AppModule {}
```

```ts
// app.controller.ts
import { Controller, Get, } from '@nestjs/common';
import { InjectModel } from 'nestjs-objection';
import { User, Post } from './app.models';

@Controller()
export class AppController {
  constructor(
    @InjectModel(User) private readonly userModel: typeof User,
    @InjectModel(Post) private readonly postModel: typeof Post,
  ) {}

  @Get()
  async getHello() {
    if (!await this.userModel.knex().schema.hasTable('users')) { 
      await User.knex().schema.createTable('users', table => {
        table.increments('id').primary();
        table.string('name');
      });
      await this.userModel.query().insert({ name: 'Name' });
    }
    if (!await this.postModel.knex().schema.hasTable('posts')) { 
      await Post.knex().schema.createTable('posts', table => {
        table.increments('id').primary();
        table.integer('userId').references('users.id');
        table.string('title');
      });
      await this.postModel.query().insert({ title: 'Title', userId: 1 });
    }

    const users = await this.userModel
      .query()
      .select(['users.name'])
      .withGraphJoined('posts')
      .modifyGraph('posts', q => q.select(['posts.title']));

    return { users }
  }
}
```

## License

MIT licensed.
