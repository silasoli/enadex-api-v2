import { Global, Module } from '@nestjs/common';
import { RoleUtil } from './utils/role.util';

@Global()
@Module({
  providers: [RoleUtil],
  exports: [RoleUtil],
})
export class RolesModule {}
