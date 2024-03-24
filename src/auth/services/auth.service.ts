import { Injectable } from '@nestjs/common';
import { UserLoginDto } from '../dto/user-login.dto';
import { JwtService } from '@nestjs/jwt';
import { ManagersService } from 'src/managers/services/managers.service';
import { StudentsService } from 'src/students/services/students.service';
import * as bcrypt from 'bcrypt';
import { Manager } from 'src/managers/schemas/manager.entity';
import { Student } from 'src/students/schemas/student.entity';
import { AUTH_ERRORS } from '../constants/auth-errors';
import { ILogin } from '../interfaces/ILogin.interface';
import { UserLoginResponseDto } from '../dto/user-login-response.dto';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private managersService: ManagersService,
    private studentsService: StudentsService,
  ) {}

  private async comparePass(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  private async sign(user: ILogin): Promise<UserLoginResponseDto> {
    const payload = { email: user.email, sub: user._id };

    return new UserLoginResponseDto({
      ...user,
      access_token: this.jwtService.sign(payload),
    });
  }

  private async validateUser(dto: UserLoginDto, user: Manager | Student) {
    const passMath = await this.comparePass(dto.password, user.password);

    const role = (user as Manager)?.role || null;

    if (!passMath) throw AUTH_ERRORS.INVALID_CREDENTIALS;

    return this.sign({
      _id: user._id,
      email: user.email,
      name: user.name,
      role,
    });
  }

  public async authenticateUser(
    dto: UserLoginDto,
  ): Promise<UserLoginResponseDto> {
    let user: Manager | Student = null;

    user = await this.studentsService.findByEmail(dto.email);
    if (user) return this.validateUser(dto, user);

    user = await this.managersService.findByEmail(dto.email);
    if (user && user.role) return this.validateUser(dto, user);

    if (!user) throw AUTH_ERRORS.INVALID_CREDENTIALS;
  }
}
