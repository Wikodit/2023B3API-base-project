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
  BadRequestException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { UserResponseDto } from './dto/user-response-dto';
import { Public } from './auth/public.decorator';
import { User } from './entities/user.entity';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@Controller('users')
@ApiTags('Users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Public()
  @UsePipes(new ValidationPipe())
  @Post('/auth/sign-up')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiBody({ type: CreateUserDto })
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
  @ApiOperation({ summary: 'Login user' })
  @ApiBody({ type: LoginDto })
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
  @Get('me')
  @ApiOperation({ summary: 'Get user profile' })
  @ApiResponse({ status: HttpStatus.OK, type: UserResponseDto })
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

  @ApiOperation({ summary: 'Get user by ID' })
  @ApiParam({ name: 'id', type: String, description: 'User ID' })
  @ApiResponse({ status: HttpStatus.OK, type: UserResponseDto })
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<UserResponseDto> {
    try {
      const user = await this.usersService.findOne(id);
      if (!user) {
        throw new NotFoundException('Unidentified User');
      }
      return {
        id: user.id,
        username: user.username,
        role: user.role,
        email: user.email,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      } else {
        throw new BadRequestException('Invalid input data.');
      }
    }
  }
  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: [UserResponseDto],
  })
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
