import { Injectable } from '@nestjs/common'
import { User } from '../user/entity/user.entity'
import { JwtService } from '@nestjs/jwt'
import { AuthTokenPayload } from './auth-token'

@Injectable()
export class AuthService {
  constructor(private readonly jwt: JwtService) {}

  /**
   * Generate a new JWT for the given user.
   */
  public async createToken(user: User): Promise<string> {
    return this.jwt.signAsync({ sub: user.id })
  }

  /**
   * Return the JWT payload or null if the given token is invalid.
   */
  public async verifyToken(token: string): Promise<AuthTokenPayload | null> {
    return this.jwt.verifyAsync(token)
  }
}
