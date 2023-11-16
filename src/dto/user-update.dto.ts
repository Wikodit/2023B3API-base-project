import { PartialType } from '@nestjs/swagger'
import { UserSignUpDto } from './user-sign-up.dto'

export class UpdateUserDto extends PartialType(UserSignUpDto) {}
