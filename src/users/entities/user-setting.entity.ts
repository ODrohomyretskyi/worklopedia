import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';

@Entity('user_setting')
export class UserSetting {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  user_id: string;

  @OneToOne(() => User, (user) => user.user_setting)
  user: User;

  @Column({ default: false })
  post_notif_on: boolean;

  @Column({ default: false })
  messaging_notif_on: boolean;

  @Column({ default: false })
  community_notif_on: boolean;

  @Column({ default: false })
  industries_notif_on: boolean;

  @Column({ default: false })
  verifications_notif_on: boolean;

  @Column({ default: false })
  search_privacy_on: boolean;

  @Column({ default: false })
  messages_privacy_on: boolean;

  @Column({ default: false })
  indicators_privacy_on: boolean;

  @Column({ default: false })
  message_nudges_on: boolean;

  @Column({ default: false })
  content_validation_on: boolean;

  @Column({ default: false })
  dark_mode_on: boolean;
}
