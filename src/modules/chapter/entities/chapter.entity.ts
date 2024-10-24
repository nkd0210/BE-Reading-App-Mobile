import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';
import { Book } from 'src/modules/book/entities/book.entity';

export type UserDocument = HydratedDocument<Chapter>;

@Schema({ timestamps: true })
export class Chapter {

    @Prop({
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Book',
        required: true
    })
    book: Book

    @Prop()
    title: string;

    @Prop()
    chapterNumber: number;

    @Prop()
    chapterImage: string;

    @Prop()
    content: string;

    @Prop({ default: false })
    isPublish: boolean;
}

export const ChapterSchema = SchemaFactory.createForClass(Chapter);

