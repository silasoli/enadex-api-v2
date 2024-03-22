import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
} from '@nestjs/common';
import { ManagersService } from '../services/managers.service';
import { CreateManagerDto } from '../dto/create-manager.dto';
import { UpdateManagerDto } from '../dto/update-manager.dto';
import { IDQueryDTO } from 'src/common/dto/id-query.dto';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ManagerResponseDto } from '../dto/manager-response.dto';

@Controller('managers')
export class ManagersController {
  constructor(private readonly managersService: ManagersService) {}

  @ApiOperation({ summary: '' })
  @ApiResponse({
    status: 200,
    description: '',
    type: ManagerResponseDto,
  })
  @ApiBody({ type: CreateManagerDto })
  @Post()
  create(
    @Body() createManagerDto: CreateManagerDto,
  ): Promise<ManagerResponseDto> {
    return this.managersService.create(createManagerDto);
  }

  @ApiOperation({ summary: '' })
  @ApiResponse({
    status: 200,
    description: '',
    type: ManagerResponseDto,
  })
  @Get()
  findAll(): Promise<ManagerResponseDto[]> {
    return this.managersService.findAll();
  }

  @ApiOperation({ summary: '' })
  @ApiResponse({
    status: 200,
    description: '',
    type: ManagerResponseDto,
  })
  @Get(':id')
  findOne(@Param() params: IDQueryDTO): Promise<ManagerResponseDto> {
    return this.managersService.findOne(params.id);
  }

  @ApiOperation({ summary: '' })
  @ApiResponse({
    status: 200,
    description: '',
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

  @ApiOperation({ summary: '' })
  @ApiResponse({
    status: 204,
    description: '',
  })
  @HttpCode(204)
  @Delete(':id')
  remove(@Param() params: IDQueryDTO): Promise<void> {
    return this.managersService.remove(params.id);
  }
}
