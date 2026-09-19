import {Controller,Get,Param} from "@nestjs/common";
import {CreatorsService} from "./creators.service";
import {Public} from "../auth/public.decorator";
@Controller("creators") export class CreatorsController{
 constructor(private readonly service:CreatorsService){}
 @Public()@Get() list(){return this.service.findAll();}
 @Public()@Get(":id") one(@Param("id") id:string){const c=this.service.findOne(id);if(!c)return {found:false};return {found:true,creator:{id:c.id,displayName:c.displayName,handle:c.handle,category:c.category,interestIndicator:c.uniqueFans>=150?"دعوت به عضویت پیشنهاد می‌شود":c.uniqueFans>=100?"علاقه عمومی قابل توجه":undefined}};}
}