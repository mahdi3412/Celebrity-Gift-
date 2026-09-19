import {Body,Controller,Post,Req} from "@nestjs/common";
import {Throttle} from "@nestjs/throttler";
import {IsEmail,IsIn,IsString,MinLength} from "class-validator";
import {AuthService} from "./auth.service";
import {Role} from "./auth.constants";
import {Public} from "./public.decorator";
import {AuthedRequest} from "./auth.types";
class RegisterDto{@IsEmail() email!:string;@IsString()@MinLength(12) password!:string;@IsIn(["fan","creator"]) role!:Extract<Role,"fan"|"creator">;}
class LoginDto{@IsEmail() email!:string;@IsString()@MinLength(1) password!:string;}
class RefreshDto{@IsString()@MinLength(20) refreshToken!:string;}
@Controller("auth")
export class AuthController{
 constructor(private readonly auth:AuthService){}
 @Public()@Throttle({default:{limit:5,ttl:60000}})@Post("register") register(@Body() dto:RegisterDto){return this.auth.register(dto.email,dto.password,dto.role);}
 @Public()@Throttle({default:{limit:5,ttl:60000}})@Post("login") login(@Body() dto:LoginDto){return this.auth.login(dto.email,dto.password);}
 @Public()@Throttle({default:{limit:10,ttl:60000}})@Post("refresh") refresh(@Body() dto:RefreshDto){return this.auth.refresh(dto.refreshToken);}
 @Post("logout") logout(@Req() req:AuthedRequest){return this.auth.logout(req.user.sub,req.user.jti);}
}