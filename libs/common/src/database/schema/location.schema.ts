import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { AbstractDocument } from '@app/common/database/schema/abstract.schema';

@Schema({ versionKey: false, timestamps: true })
export class LocationDocument extends AbstractDocument {
  @Prop({ required: true })
  name: string;
}

export const LocationSchema = SchemaFactory.createForClass(LocationDocument);
