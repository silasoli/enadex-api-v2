import { ApiProperty } from '@nestjs/swagger';
import { Manager } from '../schemas/manager.entity';

export class ManagerResponseDto {
  constructor(manager: Manager) {
    const { _id, name, email, role, active } = manager;

    return { _id: String(_id), name, email, role, active };
  }

  @ApiProperty({ required: true })
  _id: string;

  @ApiProperty({ required: true })
  name: string;

  @ApiProperty({ required: true })
  email: string;

  @ApiProperty({ required: true })
  role: string;

  @ApiProperty({ required: true })
  active: boolean;
}
