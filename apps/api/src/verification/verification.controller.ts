import {Body,Controller,Get,Param,Post} from "@nestjs/common";
import {IsBoolean,IsString} from "class-validator";
import {VerificationService} from "./verification.service";
class SubmitDto{@IsString() userId!:string;}
class ReviewDto{@IsString() userId!:string;@IsBoolean() approved!:boolean;}
@Controller("verification") export class VerificationController {
  constructor(private readonly service:VerificationService){}
  @Get(":userId") get(@Param("userId") userId:string){return this.service.get(userId);}
  @Post("submit") submit(@Body() dto:SubmitDto){return this.service.submit(dto.userId);}
  @Post("review") review(@Body() dto:ReviewDto){return this.service.review(dto.userId,dto.approved);}
}