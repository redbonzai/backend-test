import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { AbstractDocument } from '@app/common/database/abstract.schema';

@Schema({ versionKey: false, timestamps: true })
export class WorkerDocument extends AbstractDocument {
  @Prop({ required: true })
  username: string;

  @Prop({ required: true })
  hourlyWage: number;
}

export const WorkerSchema = SchemaFactory.createForClass(WorkerDocument);
