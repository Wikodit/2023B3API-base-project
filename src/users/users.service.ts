import {  Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LoginDto } from './login.dto/login.dto';
import { ResponseDto } from './login.dto/respone.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UsersService {
  constructor(
      @InjectRepository(User)
      private usersRepository: Repository<User>,
      private readonly jwtService: JwtService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<{ access_token: string; data: User; success: boolean }> {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(createUserDto.password, salt);
    const user = await this.usersRepository.create({
      username: createUserDto.username,
      email: createUserDto.email,
      password: hashedPassword,
    });
    const savedUser = await this.usersRepository.save(user);
    const payload = { sub: user.id, username: user.username };
    const accessToken = await this.jwtService.signAsync(payload);
    console.log('Utilisateur créé')
    return {
      success: true,
      data: savedUser,
        access_token: accessToken
    };
  }

  async findByEmailAndPassword(loginDto: LoginDto): Promise<ResponseDto> {
    const user = await this.usersRepository.findOne({
      where: { email: loginDto.email },
    });
    if (!user) {
      throw new Error('Invalid email or password');
    }
    const passwordMatch = await bcrypt.compare(loginDto.password, user.password);
    if (!passwordMatch) {
      return {
        success: false,
        message: 'Invalid email or password',
      };
    }
    console.log('User logged')
    return {
      success: true,
      data: {
        id: user.id,
        email: user.email,
      },
    };
  }
  async findOne(id: string): Promise<User> {
    return this.usersRepository.findOne({ where: { id } });
  }
  async findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }
}
/*async signIn(@Body() user: CreateUserDto): Promise<User> {
   const salt = randomBytes(16).toString('hex');
   const key = (await promisify(scrypt)(user.password, salt, 32)) as Buffer;

   const newUser: User = this.userRepository.create({
     ...user,
     password: key.toString('hex'), // Stocker la clé chiffrée
     salt, // Stocker le sel
   });

   return this.userRepository.save(newUser);
 }
  */
/*
  async findByEmailAndPassword(loginDto: LoginDto): Promise<ResponseDto> {
    const user = await this.userRepository.findOne({
      where: { email: loginDto.email },
    });
    if (!user) {
      return {
        success: false,
        message: 'Invalid email or password',
      };
    }

    const key = Buffer.from(user.password, 'hex'); // Convertir la clé chiffrée en Buffer
    const passwordMatch = Buffer.compare(
        key,
        Buffer.from(await promisify(scrypt)(loginDto.password, user.salt as string, 32))
    ) === 0;

    if (!passwordMatch) {
      return {
        success: false,
        message: 'Invalid email or password',
      };
    }

    return {
      success: true,
      data: {
        id: user.id,
        email: user.email,
      },
    };
  }
*/