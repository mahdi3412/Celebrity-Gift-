import {Body,Controller,Get,Param,Patch} from "@nestjs/common";
import {IsString} from "class-validator";
import {Roles} from "../auth/roles.decorator";
import {AdminService} from "./admin.service";
class InvitationStatusDto{@IsString() status!:string;}
@Controller("admin")@Roles("admin")
export class AdminController{
 constructor(private readonly service:AdminService){}
 @Get("stats") stats(){return this.service.stats();}
 @Get("users") users(){return this.service.users();}
 @Get("gifts") gifts(){return this.service.gifts();}
 @Get("creator-invitations") invitations(){return this.service.invitations();}
 @Patch("creator-invitations/:id/sent") sent(@Param("id") id:string){return this.service.markInvitationSent(id);}
}