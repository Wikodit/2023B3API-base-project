import {
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Injectable
} from '@nestjs/common'
import { User } from '../entity/user.entity'
import { Observable, map } from 'rxjs'

/** Local type alias */
type NonSensitiveUser = Omit<User, 'password'>

@Injectable()
export class PasswordInterceptor implements NestInterceptor<User, NonSensitiveUser | NonSensitiveUser[]> {

  intercept(context: ExecutionContext, next: CallHandler<User>): Observable<NonSensitiveUser | NonSensitiveUser[]> {
    return next.handle().pipe(
      map(user => (Array.isArray(user)
      // We don't need to use delete statement to remove "password" property from
      // outgoing user, we just need to override property value using "undefined" value.
      // Undefined properties are excluded from JSON serialization process.
        ? user.map(u => ({ ...u, password: undefined }))
        : { ...user, password: undefined }))
    )
  }
}
