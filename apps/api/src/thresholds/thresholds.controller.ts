import {Body,Controller,Get,Patch,Query} from "@nestjs/common";
import {IsInt,IsOptional,Min} from "class-validator";
import {ThresholdsService} from "./thresholds.service";
import {Roles} from "../auth/roles.decorator";
class UpdateThresholdsDto{@IsOptional()@IsInt()@Min(1) publicInterest?:number;@IsOptional()@IsInt()@Min(1) strongInvite?:number;@IsOptional()@IsInt()@Min(1) maxUniqueRequestsPerFan?:number;}
@Controller("thresholds")@Roles("admin")
export class ThresholdsController{
 constructor(private readonly service:ThresholdsService){}
 @Get() get(@Query("uniqueFans") uniqueFans="0",@Query("totalRequests") totalRequests="0"){return this.service.evaluate(Number(uniqueFans),Number(totalRequests)).then(result=>this.service.get().then(config=>({...result,config})));}
 @Patch() update(@Body() dto:UpdateThresholdsDto){return this.service.update(dto);}
}