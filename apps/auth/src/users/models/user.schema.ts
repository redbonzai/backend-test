import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { AbstractDocument } from '@app/common';
import mongoose, { Types } from 'mongoose';

@Schema({ versionKey: false })
export class UserDocument extends AbstractDocument {
  @Prop()
  email: string;

  @Prop()
  password: string;

  @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: 'Role' }])
  roles?: mongoose.Types.ObjectId[];

  @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: 'Permission' }])
  permissions?: mongoose.Types.ObjectId[];
}

export const UserSchema = SchemaFactory.createForClass(UserDocument);
