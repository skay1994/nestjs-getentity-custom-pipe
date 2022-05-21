import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import UserService from './user.service';

import GetEntity from '../get-entity.activerecord.pipe';
import UserEntity from '../entities-activerecord/user.activerecord.entity';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import PostEntity from '../entities-activerecord/post.activerecord.entity';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async findAll() {
    return await this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', new GetEntity(UserEntity)) user: UserEntity) {
    return user;
  }

  @Get(':id/posts')
  findOneWithPosts(
    @Param('id', new GetEntity(UserEntity, 'posts')) user: UserEntity,
  ) {
    return user.posts;
  }

  @Get(':id/posts/:postId')
  findOnePost(
    @Param('id', new GetEntity(UserEntity)) user: UserEntity,
    @Param('postId', new GetEntity(PostEntity, 'user')) post: PostEntity,
  ) {
    return { post, user };
  }

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Patch(':id')
  async update(
    @Param('id', new GetEntity(UserEntity)) user: UserEntity,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return await this.userService.update(user, updateUserDto);
  }

  @Delete(':id')
  async remove(@Param('id', new GetEntity(UserEntity)) user: UserEntity) {
    await this.userService.remove(user);
  }
}
