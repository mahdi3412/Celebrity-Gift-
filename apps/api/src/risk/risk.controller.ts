import {Controller,Get,Param,Patch,Req} from "@nestjs/common";
import {Roles} from "../auth/roles.decorator";
import {AuthedRequest} from "../auth/auth.types";
import {RiskService} from "./risk.service";
@Controller("admin/risk")@Roles("admin")
export class RiskController{
 constructor(private readonly risk:RiskService){}
 @Get() list(){return this.risk.list();}
 @Patch(":id/resolve") resolve(@Req() req:AuthedRequest,@Param("id") id:string){return this.risk.resolve(id,req.user.sub);}
}