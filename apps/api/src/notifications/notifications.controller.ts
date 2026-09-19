import {Controller,Get,Param,Patch,Req} from "@nestjs/common";
import {NotificationsService} from "./notifications.service";
import {AuthedRequest} from "../auth/auth.types";
@Controller("notifications")
export class NotificationsController{constructor(private readonly service:NotificationsService){}@Get() list(@Req() req:AuthedRequest){return this.service.listForUser(req.user.sub);}@Patch(":id/read") read(@Req() req:AuthedRequest,@Param("id") id:string){return this.service.markRead(req.user.sub,id);}}