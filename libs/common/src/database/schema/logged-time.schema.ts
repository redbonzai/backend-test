import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { AbstractDocument } from '@app/common/database/abstract.schema';
import { TaskDocument } from './task.schema';
import { WorkerDocument } from './worker.schema';

@Schema({ versionKey: false, timestamps: true })
export class LoggedTimeDocument extends AbstractDocument {
  @Prop({ required: true })
  timeSeconds: number;

  @Prop({ type: TaskDocument })
  task: TaskDocument;

  @Prop({ type: WorkerDocument })
  worker: WorkerDocument;
}

export const LoggedTimeSchema = SchemaFactory.createForClass(LoggedTimeDocument);
