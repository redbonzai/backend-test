import mongoose from 'mongoose';

export interface Location extends mongoose.Document {
  name: string;
}
