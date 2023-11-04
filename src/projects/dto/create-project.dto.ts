import { IsNotEmpty, IsOptional, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Entity } from 'typeorm';
@Entity()
export class CreateProjectDto {
  @IsNotEmpty({ message: "Name can't be empty" })
  @MinLength(3)
  @ApiProperty({ example: 'Project One', description: 'Name' })
  public name!: string;
  //@IsNotEmpty({ message: "Description can't be empty" })
  @IsOptional()
  @ApiProperty({ example: 'Project Description', description: 'Description' })
  public description?: string;
  @IsNotEmpty({ message: "Referring Employee can't be empty" })
  @ApiProperty({
    example: '50ea9634-bf10-42e7-ac3f-ece5f4c619dc',
    description: 'Referring Employee ID',
  })
  public referringEmployeeId!: string;
}
