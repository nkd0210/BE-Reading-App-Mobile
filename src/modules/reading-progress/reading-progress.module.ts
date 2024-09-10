import { Module } from '@nestjs/common';
import { ReadingProgressService } from './reading-progress.service';
import { ReadingProgressController } from './reading-progress.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ReadingProgress, ReadingProgressSchema } from './entities/reading-progress.entity';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    UsersModule,
    MongooseModule.forFeature([
      {
        name: ReadingProgress.name,
        schema: ReadingProgressSchema
      }
    ])
  ],
  controllers: [ReadingProgressController],
  providers: [ReadingProgressService],
  exports: [ReadingProgressService, MongooseModule]
})
export class ReadingProgressModule {}
