import {
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Injectable
} from '@nestjs/common'
import { User } from '../user/entity/user.entity'
import { Observable, map } from 'rxjs'

@Injectable()
export class PasswordInterceptor
  implements NestInterceptor<User, Omit<User, 'password'>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler<User>
  ): Observable<Omit<User, 'password'>> {
    return next.handle().pipe(
      map((user) => {
        const a = { ...user }
        delete a.password
        return a
      })
    )
  }
}
