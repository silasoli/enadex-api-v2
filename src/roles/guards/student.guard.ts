import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RequestWithUser } from '../../auth/interfaces/IUser-request.interface';
import { StudentsService } from '../../students/services/students.service';
import { AUTH_ERRORS } from '../../auth/constants/auth-errors';

@Injectable()
export class StudentGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private studentsService: StudentsService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const user = request.user;

    if (!user || !user._id) return false;

    const userId = String(user._id);
    try {
      await this.studentsService.findOne(userId);
    } catch (error) {
      throw AUTH_ERRORS.LACK_PERMISSION;
    }

    return true;
  }
}
