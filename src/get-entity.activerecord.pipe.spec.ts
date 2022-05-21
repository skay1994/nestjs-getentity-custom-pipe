import 'dotenv/config';
import { join } from 'path';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import GetEntity from './get-entity.activerecord.pipe';
import { AppModule } from './app.module';

import UserEntity from './entities-activerecord/user.activerecord.entity';
import PostEntity from './entities-activerecord/post.activerecord.entity';

jest.setTimeout(99999999);

describe('GetEntityPipe ActiveRecord', () => {
  let app: INestApplication;
  let target: GetEntity;
  let user: UserEntity;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [
        AppModule,
        TypeOrmModule.forRoot({
          type: 'postgres',
          autoLoadEntities: true,
          synchronize: true,
          migrationsRun: true,
          dropSchema: true,
          url: process.env.TYPEORM_PG_URL_TESTING,
          entities: [join(__dirname + process.env.TYPEORM_ENTITIES_ACTIVE)],
          cli: {
            entitiesDir: join(
              __dirname + process.env.TYPEORM_ENTITIES_ACTIVE_DIR,
            ),
          },
        }),
        TypeOrmModule.forFeature([UserEntity, PostEntity]),
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should be defined', () => {
    expect(new GetEntity(UserEntity)).toBeDefined();
  });

  describe('Return a database item', () => {
    beforeAll(() => {
      target = new GetEntity(UserEntity);
    });
    it('Return a database item', async () => {
      const user = new UserEntity();
      user.firstName = 'Jonh';
      user.lastName = 'Doe';
      user.email = 'jonh.doe@example.com';
      user.age = 25;
      await user.save();

      const result = (await target.transform(user.id)) as UserEntity;
      expect(result).toBeInstanceOf(UserEntity);
      expect(user.email).toBe(result.email);
    });
    it('Return a database item fail by invalid id', async () => {
      try {
        await target.transform('999999');
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect(error.message).toBe('Validation failed for User value');
      }
    });
    it('Return a database item fail by invalid id type', async () => {
      try {
        await target.transform('aaaaaa');
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect(error.message).toBe('No entity id provided');
      }
    });
  });

  describe('Return a database item with relations', () => {
    beforeEach(async () => {
      target = new GetEntity(UserEntity, 'posts');
      await UserEntity.query('TRUNCATE TABLE users CASCADE;');
      await PostEntity.query('TRUNCATE TABLE posts CASCADE;');

      user = new UserEntity();
      user.firstName = 'Jonh';
      user.lastName = 'Doe';
      user.email = 'jonh.doe@example.com';
      user.age = 25;
      await user.save();
    });
    it('Return a database item with relations', async () => {
      const post = new PostEntity();
      post.title = 'Post title';
      post.content = 'Post content';
      post.user = user;
      post.tags = ['tag1', 'tag2'];
      await post.save();

      user = await UserEntity.findOne({
        where: { id: user.id },
        relations: ['posts'],
      });

      const result = (await target.transform(user.id)) as UserEntity;
      const postResult = result.posts[0];
      expect(result).toBeInstanceOf(UserEntity);
      expect(user.email).toBe(result.email);
      expect(user.posts.length).toBe(result.posts.length);

      expect(postResult).toBeInstanceOf(PostEntity);
      expect(post.id).toBe(postResult.id);
      expect(post.title).toBe(postResult.title);
      expect(post.tags).toStrictEqual(postResult.tags);
    });

    it('Return a database item without relations', async () => {
      const result = (await target.transform(user.id)) as UserEntity;
      expect(result).toBeInstanceOf(UserEntity);
      expect(user.email).toBe(result.email);
      expect(result.posts.length).toBe(0);
    });
  });
});
