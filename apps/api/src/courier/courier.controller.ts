import {Controller,Get,Query,Req} from "@nestjs/common";
import {AuthedRequest} from "../auth/auth.types";
import {Roles} from "../auth/roles.decorator";
import {CourierService} from "./courier.service";
@Controller("courier")@Roles("fan","creator","admin")
export class CourierController{constructor(private readonly service:CourierService){}@Get("quote") quote(@Req() req:AuthedRequest,@Query("destinationPincode") destinationPincode?:string,@Query("giftId") giftId?:string){return this.service.quote(req.user.sub,destinationPincode,giftId);}}