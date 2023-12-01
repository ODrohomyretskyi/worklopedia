import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { ConfigService } from '@nestjs/config';

config();

const configService: ConfigService = new ConfigService();

export default new DataSource({
  type: 'postgres',
  host: configService.getOrThrow<string>('TYPEORM_HOST'),
  port: configService.getOrThrow<number>('TYPEORM_PORT'),
  username: configService.getOrThrow<string>('TYPEORM_USERNAME'),
  database: configService.getOrThrow<string>('TYPEORM_DATABASE'),
  password: configService.getOrThrow<string>('TYPEORM_PASSWORD'),
  synchronize: false,
  logging: configService.getOrThrow<boolean>('TYPEORM_LOGGING'),
  migrationsRun: false,
  entities: [__dirname + '/dist/src/**/*.entity{.js,.ts}'],
  migrations: ['dist/migrations/**'],
});
