import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { AbstractDocument } from './abstract.schema';
import { TaskDocument } from './task.schema';
import { WorkerDocument } from './worker.schema';
import { LocationDocument } from './location.schema';

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

export const LoggedTimeSchema =
  SchemaFactory.createForClass(LoggedTimeDocument);
