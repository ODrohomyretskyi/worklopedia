import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { PostActivitiesActions } from '../types/post-activities.enum';
import { IsString } from 'class-validator';

@Entity('post_activities')
export class PostActivities {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @IsString()
  user_id: string;

  @Column()
  @IsString()
  post_id: string;

  @Column()
  action: PostActivitiesActions;
}
