import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { User } from '../entity/user.entity'
import { Repository } from 'typeorm'
import { UserSignUpDto } from '../dto/user-sign-up.dto'
import { UserSignInDto } from '../dto/user-sign-in.dto'
import * as Argon2 from 'argon2'

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly repository: Repository<User>
  ) {}

  /**
   * Get user from UUID, or return null if there is no matching
   * between the given UUID and database content.
   */
  public async findById(uuid: string): Promise<User | null> {
    return this.repository.findOneBy({ id: uuid })
  }

  /**
   * Create a new user and return it.
   */
  public async create(dto: UserSignUpDto): Promise<User> {
    const user = this.repository.create({
      ...dto,
      // replace plain password with argon2 hash
      password: await Argon2.hash(dto.password)
    })

    return this.repository.save(user)
  }

  /**
   * Return the user matching to the given crendentials or null.
   */
  public async findUserFromCrendentials(dto: UserSignInDto): Promise<User | null> {
    const user = await this.repository.findOneBy({ email: dto.email })

    return user && (await Argon2.verify(user.password, dto.password))
      ? user
      : null
  }

  /**
   * Return all users
   */
  public async findAll(): Promise<User[]> {
    return this.repository.find()
  }
}
