import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LoginDto } from './dto/login.dto';
import { ResponseDto } from './login.dto/respone.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UserRoleEnum } from './entities/user.role.enum';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<{
    id: string;
    username: string;
    role: UserRoleEnum;
    email: string;
  }> {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(createUserDto.password, salt);

    const user = this.usersRepository.create({
      username: createUserDto.username,
      email: createUserDto.email,
      password: hashedPassword,
      role: createUserDto.role ?? UserRoleEnum.Employee,
    });
    const savedUser = await this.usersRepository.save(user);
    console.log('Utilisateur créé');
    return {
      id: savedUser.id,
      username: savedUser.username,
      email: savedUser.email,
      role: savedUser.role,
    };
  }

  async findByEmailAndPassword(loginDto: LoginDto): Promise<{
    id: string;
    email: string;
    access_token: string;
  }> {
    try {
      const user = await this.usersRepository.findOne({
        where: { email: loginDto.email },
      });
      if (!user) {
        throw new Error('Utilisateur non trouvé');
      }
      const passwordMatch = await bcrypt.compare(
        loginDto.password,
        user.password,
      );
      if (!passwordMatch) {
        throw new UnauthorizedException('Mot de passe invalide');
      }
      const payload = { sub: user.id, email: user.email };
      const accessToken = this.jwtService.sign(payload);
      return {
        id: user.id,
        email: user.email,
        access_token: accessToken,
      };
    } catch (error) {
      throw error;
    }
  }
  async findOne(id: string): Promise<User> {
    return this.usersRepository.findOne({ where: { id } });
  }
  async findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }
}
