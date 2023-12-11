import { IsNotEmpty, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Entity } from 'typeorm';
@Entity()
export class CreateProjectDto {
  @IsNotEmpty()
  public id!: string;

  @IsNotEmpty({ message: "Name can't be empty" })
  @MinLength(3)
  @ApiProperty({ example: 'Project One', description: 'Name' })
  public name!: string;

  @IsNotEmpty({ message: "Referring Employee ID can't be empty" })
  public referringEmployeeId!: string;
}
