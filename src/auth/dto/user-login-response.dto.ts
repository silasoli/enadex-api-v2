import { ApiProperty } from '@nestjs/swagger';
import { ILoginPayload } from '../interfaces/IPayload.inteface';

export class UserLoginResponseDto {
  constructor(user: ILoginPayload) {
    if (!user.role) delete user.role;

    return { ...user, _id: String(user._id) };
  }

  @ApiProperty({ required: true })
  _id: string;

  @ApiProperty({ required: true })
  name: string;

  @ApiProperty({ required: true })
  email: string;

  @ApiProperty({ required: false })
  role?: string;

  @ApiProperty({ required: true })
  access_token: string;
}
