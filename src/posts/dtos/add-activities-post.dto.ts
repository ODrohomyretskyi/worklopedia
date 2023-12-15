import { IsNotEmpty, IsString } from 'class-validator';
import { PostActivitiesActions } from '../types/post-activities.enum';

export class AddActivitiesPostDto {
  @IsNotEmpty()
  @IsString()
  type: PostActivitiesActions;
}
