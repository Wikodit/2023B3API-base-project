import { IsDateString, IsString, IsNotEmpty, IsUUID } from 'class-validator'

export class ProjectUserCreateDto {
  @IsString()
  @IsNotEmpty()
  @IsDateString()
  readonly startDate!: Date

  @IsString()
  @IsNotEmpty()
  @IsDateString()
  readonly endDate!: Date

  @IsString()
  @IsNotEmpty()
  @IsUUID('4')
  readonly projectId!: string

  @IsString()
  @IsNotEmpty()
  @IsUUID('4')
  readonly userId!: string
}