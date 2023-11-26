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
  Inject,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { UserResponseDto } from './dto/user-response-dto';
import { Public } from './auth/public.decorator';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import dayjs from 'dayjs';
import { EventsService } from '../events/events.service';
import { eachDayOfInterval, isWeekend } from 'date-fns';

@Controller('users')
@ApiTags('Users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,

    //@Inject(forwardRef(() => EventsService))
    @Inject(EventsService)
    private eventsService: EventsService,
  ) {}

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
      const user: UserResponseDto =
        await this.usersService.create(createUserDto);
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
      const user = await this.usersService.login(loginDto);
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
      const user: UserResponseDto = await this.usersService.findOne(
        req.user.sub,
      );
      return user;
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
      const user: UserResponseDto = await this.usersService.findOne(id);
      if (!user) {
        throw new NotFoundException('Unidentified User');
      }
      return user;
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
  async findAll(): Promise<UserResponseDto[]> {
    try {
      const users: UserResponseDto[] = await this.usersService.findAll();
      const usersResponse = users.map((user: UserResponseDto) => ({
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

  /*
GET /users/:id/meal-vouchers/:month

Speech client : En tant qu'employé, je dois pouvoir voir le montant accordé en
titres restaurant par l'entreprise pour un mois donné afin d'éviter des erreurs
comptables dans le calculs des titres restaurants.

Critères d'acceptation : Étant donné que je suis un employé et que je travaille
du Lundi au Vendredi sans interruption, et ce, même les jours féries, lorsque
je demande mon montant de titres restaurant pour un mois donné alors le système
me donne ce montant selon le calcul suivant : l'entreprise accorde 8 euros de
titres restaurants par jour travaillé par employé et les employés n'ont pas le
droit aux titres restaurants les jours de télétravail ou de congés payés

Parametres (query) :
id!: string; //au format uuidv4
month!: number; //nombres de 1 (Janvier) à 12 (Decembre)
*/

  @Get(':id/meal-vouchers/:month')
  async getMealVouchers(
    @Param('id') id: string,
    @Param('month') month: number,
  ) {
    try {
      const firstDayInSelectedMonth = dayjs()
        .month(month - 1)
        .startOf('month')
        .toDate();
      const lastDayInSelectedMonth = dayjs()
        .month(month - 1)
        .endOf('month')
        .toDate();
      const allDaysInMonth: Date[] = eachDayOfInterval({
        start: firstDayInSelectedMonth,
        end: lastDayInSelectedMonth,
      });
      const workingDays: number = allDaysInMonth.filter(
        (day: Date) => !isWeekend(day),
      ).length;
      const eventsCount: number =
        await this.eventsService.getEventsEmployeeInSelectedMonth(
          id,
          firstDayInSelectedMonth,
          lastDayInSelectedMonth,
        );
      return { ticketRestaurant: (workingDays - eventsCount) * 8 };
    } catch (error) {
      throw error;
    }
  }
}
