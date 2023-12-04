import { IsNotEmpty, IsString, IsUUID, MinLength } from 'class-validator'

export class ProjectCreateDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  readonly name!: string

  @IsString()
  @IsNotEmpty()
  @IsUUID('4')
  readonly referringEmployeeId!: string
}