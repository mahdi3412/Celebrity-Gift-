import {BadRequestException,Body,Controller,Get,Param,Post,Req,UploadedFiles,UseInterceptors} from "@nestjs/common";
import {FileFieldsInterceptor} from "@nestjs/platform-express";
import {IsBoolean,IsIn} from "class-validator";
import {VerificationService} from "./verification.service";
import {AuthedRequest} from "../auth/auth.types";
import {Roles} from "../auth/roles.decorator";
import {Throttle} from "@nestjs/throttler";
class ReviewDto{@IsBoolean() approved!:boolean;}
class EmptyDto{}
@Controller("verification")
export class VerificationController{
 constructor(private readonly service:VerificationService){}
 @Get("me") get(@Req() req:AuthedRequest){return this.service.get(req.user.sub);}
 @Roles("fan","creator") @Post("submit") @Throttle({default:{limit:3,ttl:600000}}) @UseInterceptors(FileFieldsInterceptor([{name:"document",maxCount:1},{name:"selfie",maxCount:1}],{limits:{fileSize:6*1024*1024,files:2}})) submit(@Req() req:AuthedRequest,@Body("documentType") documentType:string,@UploadedFiles() files:{document?:Array<{buffer:Buffer;originalname:string;mimetype:string;size:number}>;selfie?:Array<{buffer:Buffer;originalname:string;mimetype:string;size:number}>}){const allowed=["aadhaar","pan","passport","voter_id","driving_license"];if(!allowed.includes(documentType))throw new BadRequestException("Unsupported document type");const document=files.document?.[0];const selfie=files.selfie?.[0];if(!document||!selfie)throw new BadRequestException("document and selfie are required");return this.service.submit(req.user.sub,documentType as any,{buffer:document.buffer,fileName:document.originalname,mimeType:document.mimetype},{buffer:selfie.buffer,fileName:selfie.originalname,mimeType:selfie.mimetype});}
 @Roles("admin") @Get("admin/queue") queue(){return this.service.listManualReview();}
 @Roles("admin") @Post("review/:userId") review(@Param("userId") userId:string,@Body() dto:ReviewDto){return this.service.review(userId,dto.approved);}
}