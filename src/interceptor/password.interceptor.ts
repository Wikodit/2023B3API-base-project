import {
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Injectable
} from '@nestjs/common'
import { User } from '../entity/user.entity'
import { Observable, map } from 'rxjs'

type NonSensitiveUser = Omit<User, 'password'>

@Injectable()
export class PasswordInterceptor implements NestInterceptor<User, NonSensitiveUser | NonSensitiveUser[]> {
  intercept(context: ExecutionContext, next: CallHandler<User>): Observable<NonSensitiveUser | NonSensitiveUser[]> {
    return next.handle().pipe(
      map(user => (Array.isArray(user)
        ? user.map(u => ({ ...u, password: undefined }))
        : { ...user, password: undefined }))
    )
  }
}
