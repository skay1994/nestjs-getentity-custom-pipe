import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import UserEntity from './user.entity';

@Entity('posts')
export default class PostEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => UserEntity, (user) => user.posts)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @Column()
  user_id: number;

  @Column()
  title: string;

  @Column()
  content: string;

  @Column('json', { nullable: true })
  tags: string[];
}
