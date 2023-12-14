import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Posts } from '../../posts/entities/posts.entity';
import { User } from '../../users/entities/user.entity';

@Entity('tags')
export class Tags {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ default: 0 })
  followers_count: number;

  @Column({ default: 0 })
  post_count: number;

  @Column({ nullable: true })
  tooltip: string;

  @Column()
  icon: string;

  @Column()
  bg_color: string;

  @OneToMany(() => Posts, (post: Posts) => post.tag)
  @JoinColumn()
  posts: Posts[];

  @ManyToMany(() => User, (user: User) => user.follow_tags)
  @JoinTable()
  followers: User[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
