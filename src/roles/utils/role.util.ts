import { Injectable } from '@nestjs/common';
import { ManagersRoleEnum } from '../../managers/schemas/manager.entity';
import { ManagersService } from '../../managers/services/managers.service';

@Injectable()
export class RoleUtil {
  constructor(private readonly managersService: ManagersService) {}

  public async userHasRole(
    userid: string,
    requiredRoles: ManagersRoleEnum[],
  ): Promise<boolean> {
    const userRoles = await this.managersService.findRole(userid);

    if (!userRoles) return false;

    return this.roleHasAction([userRoles], requiredRoles);
  }

  public roleHasAction(
    roles: ManagersRoleEnum[],
    requiredRoles: ManagersRoleEnum[],
  ): boolean {
    for (const role of requiredRoles) {
      if (roles.includes(role)) return true;
    }
    return false;
  }
}
