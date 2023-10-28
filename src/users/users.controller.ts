import {
  Controller,
  Get,
  Post,
  Body,
  HttpCode,
  HttpStatus, UsePipes, ValidationPipe, Param,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import {LoginDto} from "./login.dto/login.dto";
import {ResponseDto} from "./login.dto/respone.dto";

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe())
  @Post('/auth/sign-up')
  async register(@Body() createUserDto: CreateUserDto): Promise<ResponseDto> {
    const user = await this.usersService.create(createUserDto);
    return {
      success: true,
      data: user,
    };
  }

  @Post('/auth/login')
  async login(@Body() loginDto: LoginDto): Promise<ResponseDto> {
      const user = await this.usersService.findByEmailAndPassword(loginDto);
      return {
        success: true,
        data: user,
      };
    }
  @Get()
  async findAll() {
    return this.usersService.findAll();
  }
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }
}
/*async signIn(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.usersService.signIn(createUserDto);
  }
   */
/*
  async login(@Body() loginDto: LoginDto): Promise<ResponseDto> {
    const user = await this.usersService.findByEmailAndPassword(loginDto);
    return {
      success: true,
      data: user,
    };
  }
   */