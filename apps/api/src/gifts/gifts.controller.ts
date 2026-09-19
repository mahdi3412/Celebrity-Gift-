import {Body,Controller,Get,Param,Patch,Post,Req} from "@nestjs/common";
import {IsBoolean,IsISO8601,IsOptional,IsString} from "class-validator";
import {GiftsService,GiftStatus} from "./gifts.service";
import {AuthedRequest} from "../auth/auth.types";
import {Roles} from "../auth/roles.decorator";
class CreateGiftDto{@IsString() creatorId!:string;@IsString() category!:string;@IsOptional()@IsBoolean() food?:boolean;@IsOptional()@IsBoolean() fragile?:boolean;@IsOptional()@IsBoolean() noteDeclared?:boolean;@IsOptional()@IsISO8601() foodExpiryAt?:string;}
class StatusDto{@IsIn(["REQUESTED","RECEIVED_AT_STATION","PROCESSING","SHIPPED","DELIVERED","ACCEPTED","DECLINED","RETURNED"]) status!:GiftStatus;}
@Controller("gifts")
export class GiftsController{
 constructor(private readonly service:GiftsService){}
 @Get() list(@Req() req:AuthedRequest){return this.service.listForUser(req.user.sub,req.user.role);}
 @Roles("fan")@Post() create(@Req() req:AuthedRequest,@Body() dto:CreateGiftDto){return this.service.create({...dto,fanId:req.user.sub});}
 @Get(":id") get(@Req() req:AuthedRequest,@Param("id") id:string){return this.service.getForUser(id,req.user.sub,req.user.role)??{found:false};}
 @Roles("fan","creator","admin","station_staff")@Patch(":id/status") transition(@Req() req:AuthedRequest,@Param("id") id:string,@Body() dto:StatusDto){return this.service.transitionForUser(id,dto.status,req.user.sub,req.user.role);}
}