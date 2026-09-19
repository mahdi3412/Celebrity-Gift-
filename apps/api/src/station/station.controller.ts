import {Body,Controller,Get,Param,Patch,Post,Req} from "@nestjs/common";
import {IsIn,IsOptional,IsString,MaxLength} from "class-validator";
import {GiftStatus} from "../gifts/gifts.service";
import {StationService,InspectionStatus} from "./station.service";
import {Roles} from "../auth/roles.decorator";
import {AuthedRequest} from "../auth/auth.types";

class StatusDto{@IsIn(["RECEIVED_AT_STATION","PROCESSING","SHIPPED","DELIVERED","ACCEPTED","DECLINED","RETURNED"]) status!:GiftStatus;}
class InspectionDto{@IsIn(["PENDING","CLEAR","DAMAGED","SUSPICIOUS","REQUIRES_REPACK"]) status!:InspectionStatus;@IsOptional()@IsString()@MaxLength(1000) notes?:string;}
@Controller("station")@Roles("station_staff","admin")
export class StationController{
 constructor(private readonly service:StationService){}
 @Get("scan/:giftId") scan(@Param("giftId") giftId:string){return this.service.scan(giftId);}
 @Patch(":giftId/status") status(@Req() req:AuthedRequest,@Param("giftId") giftId:string,@Body() dto:StatusDto){return this.service.updateStatus(giftId,dto.status,req.user.sub);}
 @Patch(":giftId/inspection") inspection(@Req() req:AuthedRequest,@Param("giftId") giftId:string,@Body() dto:InspectionDto){return this.service.inspect(giftId,req.user.sub,dto.status,dto.notes);}
 @Get("food-alerts/list") foodAlerts(){return this.service.foodAlerts();}
}