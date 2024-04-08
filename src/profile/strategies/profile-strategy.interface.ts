import { ManagerResponseDto } from '../../managers/dto/manager-response.dto';
import { StudentResponseDto } from '../../students/dto/student-response.dto';
import { UpdateProfileDto } from '../dto/update-profile.dto';

export interface ProfileStrategy {
  findOneProfile(_id: string): Promise<ManagerResponseDto | StudentResponseDto>;
  updateOneProfile(
    _id: string,
    dto: UpdateProfileDto,
  ): Promise<ManagerResponseDto | StudentResponseDto>;
  disableOneProfile(_id: string): Promise<void>;
}
