import mongoose from 'mongoose';

export interface Worker extends mongoose.Document {
  username: string;
  hourlyWage: number;
}
