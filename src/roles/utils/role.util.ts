import { Injectable } from '@nestjs/common';
import { ManagersRoleEnum } from '../../managers/schemas/manager.entity';
import { ManagersService } from '../../managers/services/managers.service';
import { AUTH_ERRORS } from '../../auth/constants/auth-errors';

@Injectable()
export class RoleUtil {
  constructor(private readonly managersService: ManagersService) {}

  public async userHasRole(
    userid: string,
    requiredRoles: ManagersRoleEnum[],
  ): Promise<boolean> {
    try {
      const userRoles = await this.managersService.findRole(userid);

      if (!userRoles) return false;
      return this.roleHasAction([userRoles], requiredRoles);
    } catch (error) {
      throw AUTH_ERRORS.LACK_PERMISSION;
    }
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
