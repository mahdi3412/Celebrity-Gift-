import {Body,Controller,Get,Param,Post,Req} from "@nestjs/common";
import {IsBoolean} from "class-validator";
import {VerificationService} from "./verification.service";
import {AuthedRequest} from "../auth/auth.types";
import {Roles} from "../auth/roles.decorator";
class ReviewDto{@IsBoolean() approved!:boolean;}
@Controller("verification")
export class VerificationController{
 constructor(private readonly service:VerificationService){}
 @Get("me") get(@Req() req:AuthedRequest){return this.service.get(req.user.sub);}
 @Roles("fan","creator")@Post("submit") submit(@Req() req:AuthedRequest){return this.service.submit(req.user.sub);}
 @Roles("admin")@Post("review/:userId") review(@Param("userId") userId:string,@Body() dto:ReviewDto){return this.service.review(userId,dto.approved);}
}