import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  UseGuards,
} from '@nestjs/common';
import { ManagersService } from '../services/managers.service';
import { CreateManagerDto } from '../dto/create-manager.dto';
import { UpdateManagerDto } from '../dto/update-manager.dto';
import { IDQueryDTO } from '../../common/dto/id-query.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ManagerResponseDto } from '../dto/manager-response.dto';
import { AuthUserJwtGuard } from '../../auth/guards/auth-user-jwt.guard';

@ApiBearerAuth()
@ApiTags('Managers')
@Controller('managers')
@UseGuards(AuthUserJwtGuard)
export class ManagersController {
  constructor(private readonly managersService: ManagersService) {}

  @ApiOperation({ summary: 'Criar conta de usuário' })
  @ApiResponse({
    status: 200,
    description: 'Conta de usuário criada com sucesso',
    type: ManagerResponseDto,
  })
  @ApiBody({ type: CreateManagerDto })
  @Post()
  create(
    @Body() createManagerDto: CreateManagerDto,
  ): Promise<ManagerResponseDto> {
    return this.managersService.create(createManagerDto);
  }

  @ApiOperation({ summary: 'Obter listagem de contas dos usuários' })
  @ApiResponse({
    status: 200,
    description: 'Listagem de contas dos usuários retornada com sucesso',
    type: ManagerResponseDto,
  })
  @Get()
  findAll(): Promise<ManagerResponseDto[]> {
    return this.managersService.findAll();
  }

  @ApiOperation({ summary: 'Obter conta do usuário' })
  @ApiResponse({
    status: 200,
    description: 'Conta do usuário retornada com sucesso',
    type: ManagerResponseDto,
  })
  @Get(':id')
  findOne(@Param() params: IDQueryDTO): Promise<ManagerResponseDto> {
    return this.managersService.findOne(params.id);
  }

  @ApiOperation({ summary: 'Editar conta de usuário' })
  @ApiResponse({
    status: 200,
    description: 'Editar da conta do usuário realizada com sucesso',
    type: ManagerResponseDto,
  })
  @ApiBody({ type: UpdateManagerDto })
  @Patch(':id')
  update(
    @Param() params: IDQueryDTO,
    @Body() updateManagerDto: UpdateManagerDto,
  ): Promise<ManagerResponseDto> {
    return this.managersService.update(params.id, updateManagerDto);
  }

  @ApiOperation({ summary: 'Desativar conta de um usuário' })
  @ApiResponse({
    status: 204,
    description: 'Conta do usuário desativada com sucesso',
  })
  @HttpCode(204)
  @Delete(':id')
  remove(@Param() params: IDQueryDTO): Promise<void> {
    return this.managersService.remove(params.id);
  }
}
