import mongoose from 'mongoose';

export interface IValidate {
  sub: string;

  iat: number;

  exp: number;
}

export interface IValidateReturn {
  _id: mongoose.ObjectId | string;
}
