import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';
import { User } from 'src/modules/users/entities/user.entity';
import { Book } from 'src/modules/book/entities/book.entity';

export type UserDocument = HydratedDocument<Review>;

@Schema({ timestamps: true })
export class Review {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  userId: User;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true })
  bookId: Book;

  @Prop({ required: true })
  positive: boolean;

  @Prop()
  review: string;
}

export const ReviewSchema = SchemaFactory.createForClass(Review);
