import {Body,Controller,Get,Post,Query,Req} from "@nestjs/common";
import {IsOptional,IsString,Matches,MaxLength,MinLength} from "class-validator";
import {Roles} from "../auth/roles.decorator";
import {Public} from "../auth/public.decorator";
import {AuthedRequest} from "../auth/auth.types";
import {CreatorInterestService} from "./creator-interest.service";

class InterestDto{@IsString()@Matches(/^[a-zA-Z0-9_@]{3,31}$/) handle!:string;@IsString()@MinLength(2)@MaxLength(80) displayName!:string;@IsOptional()@IsString()@MaxLength(60) category?:string;}

@Controller("creator-interests")
export class CreatorInterestController{
 constructor(private readonly service:CreatorInterestService){}
 @Roles("fan")@Post() register(@Req() req:AuthedRequest,@Body() dto:InterestDto){return this.service.register(req.user.sub,dto);}
 @Public()@Get() list(@Query("search") search=""){return this.service.list(search);}
}
