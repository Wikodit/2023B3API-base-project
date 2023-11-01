import {
  Controller,
  Get,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UsePipes,
  ValidationPipe,
  Param,
  NotFoundException,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { UserRoleEnum } from './entities/user.role.enum';
import { AuthGuard } from './auth/auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UsePipes(new ValidationPipe())
  @Post('/auth/sign-up')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() createUserDto: CreateUserDto): Promise<{
    id: string;
    username: string;
    role: UserRoleEnum;
    email: string;
  }> {
    try {
      const user = await this.usersService.create(createUserDto);
      return user;
    } catch (error) {
      throw error;
    }
  }
  @Post('/auth/login')
  @HttpCode(HttpStatus.CREATED)
  async login(@Body() loginDto: LoginDto): Promise<{
    id: string;
    email: string;
    access_token: string;
  }> {
    try {
      const user = await this.usersService.findByEmailAndPassword(loginDto);
      return user;
    } catch (error) {
      throw error;
    }
  }
  @UseGuards(AuthGuard)
  @Get('me')
  async getProfile(@Req() req): Promise<{
    id: string;
    username: string;
    role: UserRoleEnum;
    email: string;
  }> {
    const user = await this.usersService.findOne(req.user.sub);
    return {
      id: user.id,
      username: user.username,
      role: user.role,
      email: user.email,
    };
  }
  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const user = await this.usersService.findOne(id);
      if (!user) {
        throw new NotFoundException('Utilisateur non trouvé');
      }
      return user;
    } catch (error) {
      throw error;
    }
  }
  @Get()
  async findAll() {
    try {
      return this.usersService.findAll();
    } catch (error) {
      throw error;
    }
  }
}
