import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Posts } from '../../posts/entities/posts.entity';
import { Tags } from '../../tags/entities/tags.entity';

@Entity('user')
export class User {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Unique identifier',
  })
  id: string;

  @Column()
  @ApiProperty({ example: 'user@example.com', description: 'Email address' })
  email: string;

  @Column()
  @ApiProperty({ example: 'John', description: 'First name' })
  first_name: string;

  @Column()
  @ApiProperty({ example: 'Doe', description: 'Last name' })
  last_name: string;

  @Column({ nullable: true })
  username: string;

  @Column({ default: true })
  @ApiProperty({ example: true, description: 'Network status of the user' })
  status: boolean;

  @Column({ nullable: true })
  @ApiProperty({
    example: 'path/to/avatar.jpg',
    description: 'Avatar URL',
    required: false,
  })
  avatar: string;

  @Column({ default: false })
  @ApiProperty({ example: false, description: 'Email verified status' })
  email_verified: boolean;

  @Column({ nullable: true })
  @ApiProperty({
    example: '+123456789',
    description: 'Phone number',
    required: false,
  })
  phone: string;

  @OneToMany(() => Posts, (posts: Posts) => posts.author)
  @JoinColumn()
  posts: Posts[];

  @ManyToMany(() => Tags, (tag: Tags) => tag.followers)
  follow_tags: Tags[];

  @CreateDateColumn()
  @ApiProperty({
    example: '2021-01-01T00:00:00.000Z',
    description: 'Creation date',
  })
  createdAt: Date;

  @UpdateDateColumn()
  @ApiProperty({
    example: '2021-01-01T00:00:00.000Z',
    description: 'Last update date',
  })
  updatedAt: Date;
}
