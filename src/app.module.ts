import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './service/app.service';
import { UserController } from './users/user.controller';
import UserService from './users/user.service';
import PostsService from './posts/posts.service';
import PostsController from './posts/posts.controller';

import UserEntity from './entities-activerecord/user.activerecord.entity';
import PostEntity from './entities-activerecord/post.activerecord.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      autoLoadEntities: true,
      synchronize: true,
      migrationsRun: true,
      // dropSchema: true,
      url: process.env.TYPEORM_PG_URL,
      entities: [join(__dirname + process.env.TYPEORM_ENTITIES)],
      cli: {
        entitiesDir: join(__dirname + process.env.TYPEORM_ENTITIES_DIR),
      },
    }),
    TypeOrmModule.forFeature([UserEntity, PostEntity]),
  ],
  controllers: [AppController, UserController, PostsController],
  providers: [AppService, UserService, PostsService],
})
export class AppModule {}
