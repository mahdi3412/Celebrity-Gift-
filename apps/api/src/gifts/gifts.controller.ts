import {Body,Controller,Get,Param,Patch,Post} from "@nestjs/common";
import {IsBoolean,IsIn,IsString} from "class-validator";
import {GiftsService,GiftStatus} from "./gifts.service";
class CreateGiftDto {
  @IsString() creatorId!:string;
  @IsString() category!:string;
  @IsBoolean() food?:boolean;
  @IsBoolean() fragile?:boolean;
}
class StatusDto { @IsIn(["REQUESTED","RECEIVED_AT_STATION","PROCESSING","SHIPPED","DELIVERED","ACCEPTED","DECLINED","RETURNED"]) status!:GiftStatus; }
@Controller("gifts") export class GiftsController {
  constructor(private readonly service:GiftsService){}
  @Post() create(@Body() dto:CreateGiftDto){return this.service.create(dto);}
  @Get(":id") get(@Param("id") id:string){return this.service.get(id)??{found:false};}
  @Patch(":id/status") transition(@Param("id") id:string,@Body() dto:StatusDto){return this.service.transition(id,dto.status);}
}