import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import PostEntity from './post.entity';

@Entity('users')
export default class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToMany(() => PostEntity, (client) => client.user)
  @JoinColumn()
  posts: PostEntity[];

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  email: string;

  @Column({ type: 'varchar' })
  age: string | number;
}
