import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { AbstractDocument } from '@app/common/database';
import { TaskDocument } from '@tasks/models';
import { WorkerDocument } from '@workers/models';
import { LocationDocument } from '@locations/models';
// Import statements for TaskDocument, WorkerDocument, and LocationDocument

@Schema({ versionKey: false, timestamps: true })
export class LoggedTimeDocument extends AbstractDocument {
  @Prop({ required: true })
  timeSeconds: number;

  @Prop({ type: Types.ObjectId, ref: 'Task' })
  task: TaskDocument | Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Worker' })
  worker: WorkerDocument | Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Location' })
  location: LocationDocument | Types.ObjectId;
}

export const LoggedTimeSchema =
  SchemaFactory.createForClass(LoggedTimeDocument);

// Pre-save hook to generate _id if it doesn't exist
LoggedTimeSchema.pre<LoggedTimeDocument>('save', function (next) {
  if (!this._id) {
    this._id = new Types.ObjectId();
  }
  next();
});
