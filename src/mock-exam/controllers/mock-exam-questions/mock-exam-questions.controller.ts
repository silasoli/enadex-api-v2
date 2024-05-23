import {
  Controller,
  // Get,
  // Post,
  // Body,
  // Patch,
  // Param,
  // HttpCode,
  // Delete,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  // ApiBody,
  // ApiOperation,
  // ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthUserJwtGuard } from '../../../auth/guards/auth-user-jwt.guard';
import { RoleGuard } from '../../../roles/guards/role.guard';
// import { IDQueryDTO } from '../../../common/dto/id-query.dto';
// import { Role } from '../../../roles/decorators/roles.decorator';
// import { ManagersRoleEnum } from '../../../managers/schemas/manager.entity';

@ApiBearerAuth()
@ApiTags('Mock Exams')
@Controller('mock-exams')
@UseGuards(AuthUserJwtGuard, RoleGuard)
export class MockExamQuestionsController {
  // constructor(private readonly mockExamService: MockExamService) {}
}
