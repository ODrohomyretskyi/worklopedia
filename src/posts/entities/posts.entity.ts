import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Tags } from '../../tags/entities/tags.entity';
import { User } from '../../users/entities/user.entity';

@Entity('posts')
export class Posts {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  content: string;

  @ManyToOne(() => User, (user: User) => user.posts)
  @JoinColumn()
  author: User;

  @ManyToOne(() => Tags, (tag: Tags) => tag.posts, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  tag: Tags;

  @Column({ nullable: true })
  like_count: number;

  @Column({ nullable: true })
  views_count: number;

  @Column({ nullable: true })
  bookmarks_count: number;

  @Column({ nullable: true })
  comments_count: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
