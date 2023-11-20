import { IsNotEmpty, IsOptional, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Entity } from 'typeorm';
import { Exclude } from 'class-transformer';
@Entity()
export class CreateProjectDto {
  @IsNotEmpty()
  public id!: string;
  @IsNotEmpty({ message: "Name can't be empty" })
  @MinLength(3)
  @ApiProperty({ example: 'Project One', description: 'Name' })
  public name!: string;
  //@IsOptional()
  //@ApiProperty({ example: 'Project Description', description: 'Description' })
  //public description?: string;
  @IsNotEmpty({ message: "Referring Employee ID can't be empty" })
  public referringEmployeeId!: string;
}
