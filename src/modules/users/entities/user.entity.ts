import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';
import { Book } from 'src/modules/book/entities/book.entity';
import { ReadingProgress } from 'src/modules/reading-progress/entities/reading-progress.entity';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ unique: true, required: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop()
  phone: string;

  @Prop()
  refreshToken: string;

  @Prop()
  address: string;

  @Prop()
  facebookId: string;

  @Prop()
  googleId: string;

  @Prop()
  image: string;

  @Prop({ default: 'User' })
  role: string;

  @Prop()
  isActive: boolean;

  @Prop({
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Book',
      },
    ],
  })
  favourites: Types.ObjectId[];

  @Prop({
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Book',
      },
    ],
  })
  readingList: Types.ObjectId[];

  @Prop({
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ReadingProgress',
      },
    ],
  })
  readingProgress: ReadingProgress[];
}

export const UserSchema = SchemaFactory.createForClass(User);
