import {
  Controller,
  Get,
  Body,
  Patch,
  // Delete,
  UseGuards,
  // HttpCode,
} from '@nestjs/common';
import { ProfileService } from '../services/profile.service';
import { UpdateProfileDto } from '../dto/update-profile.dto';
import { UserRequest } from '../../auth/decorators/user-request.decorator';
import { UserRequestDTO } from '../../common/dto/user-request.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthUserJwtGuard } from '../../auth/guards/auth-user-jwt.guard';
import { StudentResponseDto } from '../../students/dto/student-response.dto';
import { ManagerResponseDto } from '../../managers/dto/manager-response.dto';

@ApiBearerAuth()
@ApiTags('Profile')
@Controller('profile')
@UseGuards(AuthUserJwtGuard)
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @ApiOperation({ summary: 'Obter perfil/conta do usuário logado' })
  @ApiResponse({
    status: 200,
    description: 'Conta/perfil do usuário retornada com sucesso',
    content: {
      'application/json': {
        examples: {
          ManagerResponseDto: { value: ManagerResponseDto },
          StudentResponseDto: { value: StudentResponseDto },
        },
      },
    },
  })
  @Get('me')
  public findOneProfile(
    @UserRequest() user: UserRequestDTO,
  ): Promise<ManagerResponseDto | StudentResponseDto> {
    return this.profileService.findOneProfile(user._id);
  }

  @ApiOperation({ summary: 'Editar perfil/conta do usuário logado' })
  @ApiResponse({
    status: 200,
    description:
      'Edição de conta/perfil do usuário logado realizada com sucesso',
    content: {
      'application/json': {
        examples: {
          ManagerResponseDto: { value: ManagerResponseDto },
          StudentResponseDto: { value: StudentResponseDto },
        },
      },
    },
  })
  @ApiBody({ type: UpdateProfileDto })
  @Patch('me')
  public updateOneProfile(
    @UserRequest() user: UserRequestDTO,
    @Body() updateProfileDto: UpdateProfileDto,
  ): Promise<ManagerResponseDto | StudentResponseDto> {
    return this.profileService.updateOneProfile(user._id, updateProfileDto);
  }

  // @ApiOperation({ summary: 'Desativar perfil/conta do usuário logado' })
  // @ApiResponse({
  //   status: 204,
  //   description: 'Conta/perfil do usuário logado desativado com sucesso',
  // })
  // @HttpCode(204)
  // @Delete('me')
  // public disableOneProfile(@UserRequest() user: UserRequestDTO): Promise<void> {
  //   return this.profileService.disableOneProfile(user._id);
  // }
}
