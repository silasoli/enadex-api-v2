import { Injectable } from '@nestjs/common';
import { ProfileStrategy } from './profile-strategy.interface';
import { ManagersService } from '../../managers/services/managers.service';
import { ManagerResponseDto } from '../../managers/dto/manager-response.dto';
import { UpdateManagerDto } from '../../managers/dto/update-manager.dto';

@Injectable()
export class ManagerStrategy implements ProfileStrategy {
  constructor(private readonly managersService: ManagersService) {}

  public async findOneProfile(_id: string): Promise<ManagerResponseDto> {
    return this.managersService.findOne(_id);
  }

  public async updateOneProfile(
    _id: string,
    dto: UpdateManagerDto,
  ): Promise<ManagerResponseDto> {
    return this.managersService.update(_id, dto);
  }

  public async disableOneProfile(_id: string): Promise<void> {
    return this.managersService.remove(_id);
  }
}
