import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { AbstractDocument } from '@app/common/database';
import { TaskDocument } from '@tasks/models';
import { WorkerDocument } from '@workers/models';
import { LocationDocument } from '@locations/models/location.schema';

@Schema({ versionKey: false, timestamps: true })
export class LoggedTimeDocument extends AbstractDocument {
  @Prop({ required: true })
  timeSeconds: number;

  @Prop({ type: TaskDocument })
  task: TaskDocument;

  @Prop({ type: WorkerDocument })
  worker: WorkerDocument;

  @Prop({ type: LocationDocument })
  location: LocationDocument;
}

const LoggedTimeSchema = SchemaFactory.createForClass(LoggedTimeDocument);
LoggedTimeSchema.pre<LoggedTimeDocument>('save', function (next) {
  if (!this._id) {
    this._id = new Types.ObjectId();
  }
  next();
});

export { LoggedTimeSchema };
