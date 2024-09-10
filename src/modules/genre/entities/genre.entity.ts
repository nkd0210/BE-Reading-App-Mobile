import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';
import { Book } from 'src/modules/book/entities/book.entity';

export type UserDocument = HydratedDocument<Genre>;

@Schema({ timestamps: true })
export class Genre {

    @Prop({ required: true })
    name: string;

    @Prop()
    description: string;

    @Prop({
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Book'
        }]
    })
    bookIDs: Types.ObjectId[]
}

export const GenreSchema = SchemaFactory.createForClass(Genre);
