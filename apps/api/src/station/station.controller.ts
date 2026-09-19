import {Body,Controller,Get,Param,Patch} from "@nestjs/common";
import {IsIn} from "class-validator";
import {GiftStatus} from "../gifts/gifts.service";
import {StationService} from "./station.service";
import {Roles} from "../auth/roles.decorator";
import {Role} from "../auth/auth.constants";
class StatusDto{@IsIn(["RECEIVED_AT_STATION","PROCESSING","SHIPPED","DELIVERED","ACCEPTED","DECLINED","RETURNED"]) status!:GiftStatus;}
@Controller("station") @Roles("station_staff" as Role,"admin" as Role)
export class StationController{
 constructor(private readonly service:StationService){}
 @Get("scan/:giftId") scan(@Param("giftId") giftId:string){return this.service.scan(giftId);}
 @Patch(":giftId/status") status(@Param("giftId") giftId:string,@Body() dto:StatusDto){return this.service.updateStatus(giftId,dto.status);}
}