import { Entity } from 'typeorm';
import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class CreateProjectUsersDto {
  @IsNotEmpty({ message: "Start date can't be empty" })
  @ApiProperty({ example: '08/02/21', description: 'Start date' })
  public startDate: Date;

  @IsNotEmpty({ message: "End date can't be empty" })
  @ApiProperty({ example: '09/02/21', description: 'End date' })
  public endDate: Date;

  @IsNotEmpty({ message: "Employee can't be empty" })
  @ApiProperty({
    example: '4eb180d4-73f7-4670-973b-90db7fc28dd0',
    description: 'User ID',
  })
  userId: string;

  @IsNotEmpty({ message: "Project can't be empty" })
  @ApiProperty({
    example: '4eb180d4-2234-4670-973b-90db7fc28cc6',
    description: 'Project ID',
  })
  projectId: string;
}
