import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';
import { Genre } from 'src/modules/genre/entities/genre.entity';
import { Chapter } from 'src/modules/chapter/entities/chapter.entity';
import { TagsType } from '../enum/tags.enum';

export type BookDocument = HydratedDocument<Book>;

@Schema({ timestamps: true })
export class Book {
  @Prop()
  title: string;

  @Prop()
  authorId: string;

  @Prop()
  authorImage: string;

  @Prop()
  authorName: string;

  @Prop({ type: [String], enum: TagsType }) // Use enum with an array of strings
  tags: TagsType[];

  @Prop()
  plot: string;

  @Prop()
  coverImage: string;

  @Prop({ default: 0 })
  views: number;

  @Prop({ default: 0 })
  totalVotes: number;

  @Prop({ default: 0 })
  positiveVotes: number;

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Chapter' }],
  })
  chapters: Types.ObjectId[];

  @Prop({ default: false })
  isPublish: boolean;
}

export const BookSchema = SchemaFactory.createForClass(Book);
