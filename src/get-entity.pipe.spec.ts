import 'dotenv/config';
import { join } from 'path';
import { Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Repository, getRepository } from 'typeorm';
import { INestApplication } from '@nestjs/common';

import GetEntity from './get-entity.pipe';
import { AppModule } from './app.module';

import UserEntity from './entities/user.entity';
import PostEntity from './entities/post.entity';

describe('GetEntityPipe', () => {
  let app: INestApplication;
  let target: GetEntity;
  let user: UserEntity;
  let userRepository: Repository<UserEntity>;
  let postRepository: Repository<PostEntity>;

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
          entities: [join(__dirname + process.env.TYPEORM_ENTITIES)],
          cli: {
            entitiesDir: join(__dirname + process.env.TYPEORM_ENTITIES_DIR),
          },
        }),
        TypeOrmModule.forFeature([UserEntity, PostEntity]),
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    userRepository = getRepository(UserEntity);
    postRepository = getRepository(PostEntity);
  });

  afterAll(async () => {
    await app.close();
  });

  it('should be defined', () => {
    expect(new GetEntity(UserEntity)).toBeDefined();
  });

  describe('Return a database item', () => {
    beforeEach(() => {
      target = new GetEntity(UserEntity);
    });
    it('Return a database item', async () => {
      const user = new UserEntity();
      user.firstName = 'Jonh';
      user.lastName = 'Doe';
      user.email = 'jonh.doe@example.com';
      user.age = 25;

      await userRepository.save(user);

      const result = (await target.transform(user.id)) as UserEntity;
      expect(result).toBeInstanceOf(UserEntity);
      expect(user.email).toBe(result.email);
    });
    it('Return a database item fail by invalid uuid', async () => {
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
      await userRepository.query('TRUNCATE TABLE users CASCADE;');
      await postRepository.query('TRUNCATE TABLE posts CASCADE;');

      user = new UserEntity();
      user.firstName = 'Jonh';
      user.lastName = 'Doe';
      user.email = 'jonh.doe@example.com';
      user.age = 25;
      await userRepository.save(user);
    });
    it('Return a database item with relations', async () => {
      const post = new PostEntity();
      post.title = 'Post title';
      post.content = 'Post content';
      post.user = user;
      post.tags = ['tag1', 'tag2'];
      await postRepository.save(post);

      user = await userRepository.findOne({
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
