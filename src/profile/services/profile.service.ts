import { Injectable } from '@nestjs/common';
import { ProfileStrategyImpl } from '../strategies/profile-strategy-impl';
import { StudentResponseDto } from '../../students/dto/student-response.dto';
import { ManagerResponseDto } from '../../managers/dto/manager-response.dto';
import { UpdateProfileDto } from '../dto/update-profile.dto';

@Injectable()
export class ProfileService {
  constructor(private readonly profileStrategy: ProfileStrategyImpl) {}

  public async findOneProfile(
    _id: string,
  ): Promise<ManagerResponseDto | StudentResponseDto> {
    return this.profileStrategy.findOneProfile(_id);
  }

  public async updateOneProfile(
    _id: string,
    dto: UpdateProfileDto,
  ): Promise<ManagerResponseDto | StudentResponseDto> {
    return this.profileStrategy.updateOneProfile(_id, dto);
  }

  public async disableOneProfile(_id: string): Promise<void> {
    return this.profileStrategy.disableOneProfile(_id);
  }
}
