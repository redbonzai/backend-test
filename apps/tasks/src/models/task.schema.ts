import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { AbstractDocument } from '@app/common/database/schema/abstract.schema';
import { LocationDocument } from '@locations/models';
import { Types } from 'mongoose';

@Schema({ versionKey: false, timestamps: true })
export class TaskDocument extends AbstractDocument {
  @Prop({ required: true })
  description: string;

  @Prop({ type: LocationDocument })
  location: LocationDocument;

  @Prop({ required: true, default: false })
  completed: boolean;
}

// pre-save hook to ensure that the _id is set before saving the document
export const TaskSchema = SchemaFactory.createForClass(TaskDocument);
TaskSchema.pre<TaskDocument>('save', function (next) {
  if (!this._id) {
    this._id = new Types.ObjectId();
  }
  next();
});
