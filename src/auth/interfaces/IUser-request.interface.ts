import { IValidateReturn } from './IValidate.interface';

export interface RequestWithUser {
  Request: Request;
  user: IValidateReturn;
}
