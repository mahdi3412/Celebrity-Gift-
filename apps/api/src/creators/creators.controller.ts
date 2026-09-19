import {Body,Controller,Get,Param,Patch,Query,Req} from "@nestjs/common";
import {IsOptional,IsString,Matches,MaxLength,MinLength} from "class-validator";
import {CreatorsService} from "./creators.service";
import {Public} from "../auth/public.decorator";
import {Roles} from "../auth/roles.decorator";
import {AuthedRequest} from "../auth/auth.types";
class UpdateCreatorDto{@IsString()@MinLength(2)@MaxLength(80) displayName!:string;@IsString()@Matches(/^[a-zA-Z0-9_]{3,30}$/) handle!:string;@IsOptional()@IsString()@MaxLength(60) category?:string;@IsOptional()@IsString()@MaxLength(500) publicBio?:string;}
@Controller("creators")
export class CreatorsController{
 constructor(private readonly service:CreatorsService){}
 @Public()@Get() list(@Query("search") search=""){return this.service.findAll(search);}
 @Public()@Get(":id") async one(@Param("id") id:string){const c=await this.service.findOne(id);if(!c)return {found:false};return {found:true,creator:{id:c.id,displayName:c.displayName,handle:c.handle,category:c.category,interestIndicator:c.uniqueFans>=150?"دعوت به عضویت پیشنهاد می‌شود":c.uniqueFans>=100?"علاقه عمومی قابل توجه":undefined}};}
 @Roles("creator")@Patch("me") profile(@Req() req:AuthedRequest,@Body() dto:UpdateCreatorDto){return this.service.updateProfile(req.user.sub,dto).catch(error=>{if(error?.code==="23505")throw new Error("Handle already in use");throw error;});}
}