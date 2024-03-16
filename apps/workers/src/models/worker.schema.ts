import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { AbstractDocument } from '@app/common/database/schema/abstract.schema';
import { Types } from 'mongoose';

@Schema({ versionKey: false, timestamps: true })
export class WorkerDocument extends AbstractDocument {
  @Prop({ required: true })
  username: string;

  @Prop({ required: true })
  hourlyWage: number;
}

// Access the schema from the WorkerDocument class
const WorkerSchema = SchemaFactory.createForClass(WorkerDocument);

// Define pre-save hook to generate _id field before saving
WorkerSchema.pre<WorkerDocument>('save', function (next) {
  if (!this._id) {
    // Generate _id if it doesn't exist
    this._id = new Types.ObjectId();
  }
  next();
});

export { WorkerSchema };
