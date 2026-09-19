import {CanActivate,ExecutionContext,Injectable,UnauthorizedException} from "@nestjs/common";
import {Reflector} from "@nestjs/core";
import {JwtService} from "@nestjs/jwt";
import {DatabaseService} from "../database/database.service";
import {IS_PUBLIC_KEY} from "./public.decorator";
@Injectable()
export class AuthGuard implements CanActivate{
 constructor(private readonly reflector:Reflector,private readonly jwt:JwtService,private readonly db:DatabaseService){}
 async canActivate(context:ExecutionContext){
  if(this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY,[context.getHandler(),context.getClass()]))return true;
  const req=context.switchToHttp().getRequest();const header=req.headers.authorization;
  if(!header?.startsWith("Bearer "))throw new UnauthorizedException("Authentication required");
  let payload:any;
  try{payload=await this.jwt.verifyAsync(header.slice(7),{secret:process.env.JWT_ACCESS_SECRET});}catch{throw new UnauthorizedException("Invalid or expired access token");}
  const result=await this.db.query<{role:string,status:string}>("SELECT role,status FROM users WHERE id=$1",[payload.sub]);
  const user=result.rows[0];if(!user||user.status!=="ACTIVE")throw new UnauthorizedException("Account is inactive");
  req.user={...payload,role:user.role};return true;
 }
}