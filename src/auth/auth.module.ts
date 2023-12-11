import { Module } from "@nestjs/common";
import { JwtModule, JwtService } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { JwtStrategy } from "./jwtStrat";
import { AuthGuard } from "./guard";
import { jwtConstants } from "./constant";

@Module({
    imports: [
        JwtModule.register({
            secret: jwtConstants.secret,
            signOptions: { expiresIn: '1h' },
        }),
        PassportModule.register({ defaultStrategy: 'jwt' }),
    ],
    providers: [JwtService],
    exports: [JwtService]
})
export class AuthModule {}