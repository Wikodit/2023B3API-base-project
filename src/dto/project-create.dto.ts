import { IsString, IsUUID } from 'class-validator'

export class ProjectCreateDto {
  @IsString()
  public name: string

  @IsString()
  @IsUUID('4')
  public referringEmployeeId: string
}