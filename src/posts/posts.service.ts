import { Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import PostEntity from '../entities-activerecord/post.activerecord.entity';

@Injectable()
export default class PostsService {
  async create(data: CreatePostDto) {
    const post = new PostEntity();
    post.title = data.title;
    post.content = data.content;
    post.tags = data.tags;
    post.user_id = data.user_id;
    try {
      await post.save();
    } catch (error) {
      return error;
    }
    return post;
  }

  findAll() {
    return PostEntity.find();
  }

  async update(post: PostEntity, data: UpdatePostDto) {
    try {
      await PostEntity.update(post.id, data);
    } catch (error) {
      return error;
    }
    await post.reload();
    return post;
  }

  async remove(post: PostEntity) {
    await PostEntity.delete(post.id);
  }
}
