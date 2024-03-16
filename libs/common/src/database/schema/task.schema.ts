import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { AbstractDocument } from './abstract.schema';
import { LocationDocument } from './location.schema';

@Schema({ versionKey: false, timestamps: true })
export class TaskDocument extends AbstractDocument {
  @Prop({ required: true })
  description: string;

  @Prop({ type: LocationDocument })
  location: LocationDocument;
}

export const TaskSchema = SchemaFactory.createForClass(TaskDocument);
