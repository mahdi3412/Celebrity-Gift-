import {CanActivate,ExecutionContext,ForbiddenException,Injectable} from "@nestjs/common";
import {Reflector} from "@nestjs/core";
import {ROLES_KEY} from "./roles.decorator";
import {Role} from "./auth.constants";
@Injectable()
export class RolesGuard implements CanActivate{
 constructor(private readonly reflector:Reflector){}
 canActivate(context:ExecutionContext){const roles=this.reflector.getAllAndOverride<Role[]>(ROLES_KEY,[context.getHandler(),context.getClass()]);if(!roles?.length)return true;const user=context.switchToHttp().getRequest().user;if(!user?.role||!roles.includes(user.role))throw new ForbiddenException("Insufficient role");return true;}
}