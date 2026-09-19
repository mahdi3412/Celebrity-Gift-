import {Body,Controller,Post} from "@nestjs/common";
import {IsEmail,IsIn,IsString,MinLength} from "class-validator";
import {AuthService} from "./auth.service";
import {Role} from "./auth.constants";
class RegisterDto{@IsEmail() email!:string;@IsString()@MinLength(12) password!:string;@IsIn(["fan","creator"]) role!:Extract<Role,"fan"|"creator">;}
class LoginDto{@IsEmail() email!:string;@IsString()@MinLength(1) password!:string;}
@Controller("auth") export class AuthController{constructor(private readonly auth:AuthService){}@Post("register") register(@Body() dto:RegisterDto){return this.auth.register(dto.email,dto.password,dto.role);}@Post("login") login(@Body() dto:LoginDto){return this.auth.login(dto.email,dto.password);}}