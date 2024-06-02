import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ManagersService } from '../../managers/services/managers.service';
import { RequestWithUser } from '../interfaces/IUser-request.interface';
import { StudentsService } from '../../students/services/students.service';
import { ManagerResponseDto } from '../../managers/dto/manager-response.dto';
import { StudentResponseDto } from '../../students/dto/student-response.dto';
import { AUTH_ERRORS } from '../constants/auth-errors';

@Injectable()
export class AuthUserJwtGuard extends AuthGuard('jwt') {
  constructor(
    private readonly managersService: ManagersService,
    private readonly studentsService: StudentsService,
  ) {
    super();
  }

  async canActivate(
    context: import('@nestjs/common').ExecutionContext,
  ): Promise<boolean> {
    await super.canActivate(context);

    const request: RequestWithUser = context.switchToHttp().getRequest();
    const userID = String(request?.user?._id);

    let user: ManagerResponseDto | StudentResponseDto = null;

    try {
      user = await this.studentsService.findOne(userID);
    } catch (error) {}

    if (!user)
      try {
        user = await this.managersService.findOne(userID);
      } catch (error) {}

    if (user && user.active) return true;

    throw AUTH_ERRORS.USER_DISABLED;
  }
}
