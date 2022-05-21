import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import PostEntity from './post.activerecord.entity';

@Entity('users')
export default class UserEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToMany(() => PostEntity, (post) => post.user)
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
