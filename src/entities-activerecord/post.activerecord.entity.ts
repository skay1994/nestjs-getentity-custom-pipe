import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import UserEntity from './user.activerecord.entity';

@Entity('posts')
export default class PostEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => UserEntity, (user) => user.posts)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @Column()
  user_id: string;

  @Column()
  title: string;

  @Column()
  content: string;

  @Column('json', { nullable: true })
  tags: string[];
}
