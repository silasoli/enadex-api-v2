import { SetMetadata } from '@nestjs/common';
import { ManagersRoleEnum } from '../../managers/schemas/manager.entity';

export const ROLE_KEY = 'role';
export const Role = (roles: ManagersRoleEnum[]) => SetMetadata(ROLE_KEY, roles); 
