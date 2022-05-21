import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import UserEntity from '../entities-activerecord/user.activerecord.entity';

@Injectable()
export default class UserService {
  async create(data: CreateUserDto) {
    const user = new UserEntity();
    user.firstName = data.firstName;
    user.lastName = data.lastName;
    user.email = data.email;
    user.age = data.age;
    await user.save();
    return user;
  }

  async findAll() {
    return await UserEntity.find();
  }

  async update(user: UserEntity, data: UpdateUserDto) {
    await UserEntity.update(user.id, data);
    await user.reload();
    return user;
  }

  async remove(user: UserEntity) {
    await UserEntity.delete(user.id);
  }
}
