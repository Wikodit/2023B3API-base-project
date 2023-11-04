import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProjectDto {
  @IsNotEmpty({ message: "Name can't be empty" })
  @ApiProperty({ example: 'Project One', description: 'Name' })
  public name!: string;
  @IsNotEmpty({ message: "Referring Employee can't be empty" })
  @ApiProperty({
    example: '50ea9634-bf10-42e7-ac3f-ece5f4c619dc',
    description: 'Referring Employee ID',
  })
  public referringEmployeeId!: string;
}
