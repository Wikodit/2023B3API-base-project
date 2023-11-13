import { Injectable } from '@nestjs/common'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { Repository } from 'typeorm'
import { User } from './entities/user.entity'
import { InjectRepository } from '@nestjs/typeorm'

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly repo: Repository<User>
  ) {}

  async create(dto: CreateUserDto): Promise<User> {
    return this.repo.save(this.repo.create(dto))
  }

  async findAll(): Promise<User[]> {
    return await this.repo.find()
  }

  async findOne(uuid: string): Promise<User> {
    return await this.repo.findOne({ where: { id: uuid } })
  }

  async update(uuid: string, dto: UpdateUserDto): Promise<User> {
    /* Not yet implemented */
    return null
  }

  async remove(user: User): Promise<User> {
    return await this.repo.remove(user)
  }
}
