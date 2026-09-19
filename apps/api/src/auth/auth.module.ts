import {Module} from "@nestjs/common";
import {JwtModule} from "@nestjs/jwt";
import {AuthController} from "./auth.controller";
import {AuthService} from "./auth.service";
@Module({imports:[JwtModule.register({secret:process.env.JWT_ACCESS_SECRET,signOptions:{expiresIn:process.env.JWT_ACCESS_TTL??"15m"}})],providers:[AuthService],controllers:[AuthController],exports:[AuthService]})
export class AuthModule{}