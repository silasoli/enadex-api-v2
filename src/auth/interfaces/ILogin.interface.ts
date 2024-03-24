import mongoose from 'mongoose';

export interface ILogin {
  _id?: mongoose.ObjectId | string;

  name: string;

  email: string;
}
