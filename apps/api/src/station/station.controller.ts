import {Body,Controller,Get,Param,Patch} from "@nestjs/common";
import {IsIn} from "class-validator";
import {GiftStatus} from "../gifts/gifts.service";
import {StationService} from "./station.service";
class StatusDto{@IsIn(["RECEIVED_AT_STATION","PROCESSING","SHIPPED","DELIVERED","ACCEPTED","DECLINED","RETURNED"]) status!:GiftStatus;}
@Controller("station") export class StationController {
  constructor(private readonly service:StationService){}
  @Get("scan/:giftId") scan(@Param("giftId") giftId:string){return this.service.scan(giftId);}
  @Patch(":giftId/status") status(@Param("giftId") giftId:string,@Body() dto:StatusDto){return this.service.updateStatus(giftId,dto.status);}
}