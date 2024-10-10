import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';
import { Genre } from 'src/modules/genre/entities/genre.entity';
import { Chapter } from 'src/modules/chapter/entities/chapter.entity';

export type BookDocument = HydratedDocument<Book>;

@Schema({ timestamps: true })
export class Book {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  author: string;

  @Prop({
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Genre',
      },
    ],
  })
  tags: Types.ObjectId[];

  @Prop({ required: true })
  plot: string;

  @Prop()
  coverImage: string;

  @Prop({ default: 0 })
  views: number;

  @Prop({ default: 0 })
  totalVotes: number;

  @Prop({ default: 0 })
  positiveVote: number;

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Chapter' }],
  })
  chapters: Types.ObjectId[];
}

export const BookSchema = SchemaFactory.createForClass(Book);
