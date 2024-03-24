import { ApiProperty } from '@nestjs/swagger';
import { ILoginPayload } from '../interfaces/IPayload.inteface';

export class UserLoginResponseDto {
  constructor(user: ILoginPayload) {
    const { _id, name, email, access_token } = user;

    return { _id: String(_id), name, email, access_token };
  }

  @ApiProperty({ required: true })
  _id: string;

  @ApiProperty({ required: true })
  name: string;

  @ApiProperty({ required: true })
  email: string;

  @ApiProperty({ required: true })
  access_token: string;
}
