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
  BadRequestException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { AuthGuard } from './auth/auth.guard';
import { UserResponseDto } from './dto/user-response-dto';
import { Public } from './auth/public.decorator';
import { User } from './entities/user.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Public()
  @UsePipes(new ValidationPipe())
  @Post('/auth/sign-up')
  @HttpCode(HttpStatus.CREATED)
  async register(
    @Body() createUserDto: CreateUserDto,
  ): Promise<UserResponseDto> {
    try {
      const user = await this.usersService.create(createUserDto);
      return user;
    } catch (error) {
      throw error;
    }
  }
  @Public()
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
  //@UseGuards(AuthGuard)
  @Get('me')
  async getProfile(@Req() req): Promise<UserResponseDto> {
    try {
      const user: User = await this.usersService.findOne(req.user.sub);
      return {
        id: user.id,
        username: user.username,
        role: user.role,
        email: user.email,
      };
    } catch (error) {
      throw error;
    }
  }
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<UserResponseDto> {
    try {
      const user: User = await this.usersService.findOne(id);
      if (!user) {
        throw new NotFoundException('Utilisateur non trouvé');
      }
      return {
        id: user.id,
        username: user.username,
        role: user.role,
        email: user.email,
      };
    } catch (error) {
      throw error;
    }
  }
  @Get()
  async findAll(): Promise<
    Array<{
      id: string;
      username: string;
      role: string;
      email: string;
    }>
  > {
    try {
      const users = await this.usersService.findAll();
      const usersResponse = users.map((user) => ({
        id: user.id,
        username: user.username,
        role: user.role,
        email: user.email,
      }));

      return usersResponse;
    } catch (error) {
      throw error;
    }
  }
}
