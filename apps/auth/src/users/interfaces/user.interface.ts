import mongoose from 'mongoose';

export interface User extends mongoose.Document {
  email: string;
  password: string;
}
