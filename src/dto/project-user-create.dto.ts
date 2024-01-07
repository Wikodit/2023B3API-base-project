import { Type } from 'class-transformer'
import { IsDate, IsNotEmpty, IsString, IsUUID } from 'class-validator'

export class ProjectUserCreateDto {
  @Type(() => Date)
  @IsDate()
  readonly startDate!: Date

  @Type(() => Date)
  @IsDate()
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
