import {Body,Controller,Post} from "@nestjs/common";
import {IsIn,IsString,MinLength} from "class-validator";
import {AuthService} from "./auth.service";
class DemoLoginDto {
  @IsString() @MinLength(1) userId!:string;
  @IsIn(["fan","creator","admin"]) role!:"fan"|"creator"|"admin";
}
@Controller("auth") export class AuthController {
  constructor(private readonly auth:AuthService){}
  @Post("demo-token") token(@Body() dto:DemoLoginDto){return this.auth.issueDemoToken(dto.userId,dto.role);}
}