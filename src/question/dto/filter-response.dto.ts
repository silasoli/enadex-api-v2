import { ApiProperty } from '@nestjs/swagger';

export class FilterResponseDto {
  @ApiProperty({ required: true })
  filter: string;

  @ApiProperty({ required: true })
  values: unknown[];
}
