import {Controller,Get,Query} from "@nestjs/common";
import {ThresholdsService} from "./thresholds.service";
import {Roles} from "../auth/roles.decorator";
@Controller("thresholds") @Roles("admin")
export class ThresholdsController{constructor(private readonly service:ThresholdsService){}@Get() get(@Query("uniqueFans") uniqueFans="0",@Query("totalRequests") totalRequests="0"){return {...this.service.evaluate(Number(uniqueFans),Number(totalRequests)),config:this.service.get()};}}