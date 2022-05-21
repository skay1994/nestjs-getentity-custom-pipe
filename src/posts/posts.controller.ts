import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import PostsService from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import GetEntity from '../get-entity.activerecord.pipe';
import PostEntity from '../entities-activerecord/post.activerecord.entity';

@Controller('posts')
export default class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  findAll() {
    return this.postsService.findAll();
  }

  @Post()
  async create(@Body() data: CreatePostDto) {
    return await this.postsService.create(data);
  }

  @Get(':id')
  findOne(@Param('id', new GetEntity(PostEntity)) post: PostEntity) {
    return post;
  }

  @Patch(':id')
  update(
    @Param('id', new GetEntity(PostEntity)) post: PostEntity,
    @Body() updatePostDto: UpdatePostDto,
  ) {
    return this.postsService.update(post, updatePostDto);
  }

  @Delete(':id')
  remove(@Param('id', new GetEntity(PostEntity)) post: PostEntity) {
    return this.postsService.remove(post);
  }
}
