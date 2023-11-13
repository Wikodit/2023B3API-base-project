import {
  Controller,
  // Get,
  Post,
  Body
  // Patch,
  // Param,
  // Delete
} from '@nestjs/common'
import { UserService } from './user.service'
import { User } from './entities/user.entity'
import { CreateUserDto } from './dto/create-user.dto'
// import { UpdateUserDto } from './dto/update-user.dto'

@Controller('users')
export class UserController {
  constructor(private readonly users: UserService) {}

  @Post('/auth/sign-up')
  async create(@Body() dto: CreateUserDto): Promise<User> {
    return this.users.create(dto)
  }

  // @Get()
  // findAll() {
  //   return this.userService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.userService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
  //   return this.userService.update(+id, updateUserDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.userService.remove(+id);
  // }
}
