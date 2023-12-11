import {
  Controller,
  Post,
  Body,
  ValidationPipe,
  UsePipes,
  HttpStatus,
  HttpCode,
  Get,
  Req,
  UseGuards,
  Param,
  forwardRef,
  Inject,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { loginUserDto } from './dto/login-user.dto';
import { AuthGuard } from '../auth/guard';
import { EventsService } from '../events/events.service';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    @Inject(forwardRef(() => EventsService))
    private readonly eventService: EventsService,
  ) {}

  @Post('auth/sign-up')
  @UsePipes(new ValidationPipe())
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @HttpCode(HttpStatus.CREATED)
  @Post('auth/login')
  @UsePipes(new ValidationPipe())
  signIn(@Body() signIn: loginUserDto) {
    return this.usersService.signIn(signIn);
  }
  @UseGuards(AuthGuard)
  @Get()
  findAll() {
    return this.usersService.findAll();
  }
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  @Get('me')
  returnUser(@Req() req) {
    const user = this.usersService.returnUser(req.user.sub);
    if (!user) {
      return 'Utilisateur non trouvé';
    }
    return user;
  }
  @UseGuards(AuthGuard)
  @Get(':id')
  getUserById(@Param('id') userId: string) {
    const user = this.usersService.returnUser(userId);
    return user;
  }
  @UseGuards(AuthGuard)
  @Get(':id/meal-vouchers/:month')
  async getMealVouchersAmount(
    @Param('id') userId: string,
    @Param('month') month: number,
  ) {
    // Calculer le montant des titres-restaurant en utilisant la méthode du service
    const amount = await this.eventService.calculateMealVouchers(userId, month);
    return { ticketRestaurant: amount };
  }
}