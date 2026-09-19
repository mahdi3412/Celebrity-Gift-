import {CanActivate,ExecutionContext,Injectable,UnauthorizedException} from "@nestjs/common";
import {Reflector} from "@nestjs/core";
import {JwtService} from "@nestjs/jwt";
import {IS_PUBLIC_KEY} from "./public.decorator";
@Injectable()
export class AuthGuard implements CanActivate{
 constructor(private readonly reflector:Reflector,private readonly jwt:JwtService){}
 async canActivate(context:ExecutionContext){if(this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY,[context.getHandler(),context.getClass()]))return true;const req=context.switchToHttp().getRequest();const header=req.headers.authorization;if(!header?.startsWith("Bearer "))throw new UnauthorizedException("Authentication required");try{req.user=await this.jwt.verifyAsync(header.slice(7),{secret:process.env.JWT_ACCESS_SECRET});return true;}catch{throw new UnauthorizedException("Invalid or expired access token");}}
}