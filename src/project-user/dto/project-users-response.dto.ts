import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class ProjectUsersResponseDto {
  @ApiProperty({
    example: '4eb180d4-73f7-4670-973b-90db7fc28dd0',
    description: 'Project user ID',
  })
  @IsNotEmpty()
  public id: string;

  @ApiProperty({
    example: '2023-01-01',
    description: 'Start date',
    type: 'string',
    format: 'date-time',
  })
  @IsNotEmpty()
  startDate: Date;

  @ApiProperty({
    example: '2023-12-31',
    description: 'End date',
    type: 'string',
    format: 'date-time',
  })
  @IsNotEmpty()
  endDate: Date;

  @ApiProperty({
    example: '4eb180d4-73f7-4670-973b-90db7fc28dd0',
    description: 'User ID',
  })
  @IsNotEmpty()
  userId: string;

  @ApiProperty({
    example: '4eb180d4-2234-4670-973b-90db7fc28cc6',
    description: 'Project ID',
  })
  @IsNotEmpty()
  projectId: string;
}
