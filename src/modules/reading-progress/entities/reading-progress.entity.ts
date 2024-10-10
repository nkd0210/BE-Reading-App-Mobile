import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';
import { User } from 'src/modules/users/entities/user.entity';
import { Book } from 'src/modules/book/entities/book.entity';
import { Chapter } from 'src/modules/chapter/entities/chapter.entity';

export type UserDocument = HydratedDocument<ReadingProgress>;

@Schema({ timestamps: true })
export class ReadingProgress {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  user: User;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true })
  book: Book;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Chapter' })
  currentChapter: Chapter;

  @Prop({ required: true, default: 0 })
  progress: number;

  @Prop({ required: true, default: false })
  isCompleted: boolean;
}

export const ReadingProgressSchema =
  SchemaFactory.createForClass(ReadingProgress);
