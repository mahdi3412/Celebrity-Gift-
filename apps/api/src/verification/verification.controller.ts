import {BadRequestException,Body,Controller,Get,Header,Param,Post,Req,StreamableFile,UploadedFiles,UseInterceptors} from "@nestjs/common";
import {FileFieldsInterceptor} from "@nestjs/platform-express";
import {IsBoolean} from "class-validator";
import {VerificationService} from "./verification.service";
import {AuthedRequest} from "../auth/auth.types";
import {Roles} from "../auth/roles.decorator";
import {Throttle} from "@nestjs/throttler";
class ReviewDto{@IsBoolean() approved!:boolean;}

@Controller("verification")
export class VerificationController{
 constructor(private readonly service:VerificationService){}
 @Get("me") get(@Req() req:AuthedRequest){return this.service.get(req.user.sub);}
 @Roles("fan","creator") @Post("submit") @Throttle({default:{limit:20,ttl:600000}}) @UseInterceptors(FileFieldsInterceptor([{name:"document",maxCount:1},{name:"selfie",maxCount:1}],{limits:{fileSize:6*1024*1024,files:2}})) submit(@Req() req:AuthedRequest,@Body("documentType") documentType:string,@UploadedFiles() files:{document?:Array<{buffer:Buffer;originalname:string;mimetype:string;size:number}>;selfie?:Array<{buffer:Buffer;originalname:string;mimetype:string;size:number}>}){const allowed=["aadhaar","pan","passport","voter_id","driving_license"];if(!allowed.includes(documentType))throw new BadRequestException("Unsupported document type");const document=files.document?.[0];const selfie=files.selfie?.[0];if(!document||!selfie)throw new BadRequestException("document and selfie are required");
const docTypes=["application/pdf","image/jpeg","image/png","image/webp"];const selfieTypes=["image/jpeg","image/png","image/webp"];
if(!docTypes.includes(document.mimetype)||!selfieTypes.includes(selfie.mimetype))throw new BadRequestException("Unsupported file type");
if(document.size>6*1024*1024||selfie.size>6*1024*1024)throw new BadRequestException("Each file must be 6MB or smaller");
return this.service.submit(req.user.sub,documentType as any,{buffer:document.buffer,fileName:document.originalname,mimeType:document.mimetype},{buffer:selfie.buffer,fileName:selfie.originalname,mimeType:selfie.mimetype});}
 @Roles("admin") @Get("admin/queue") queue(){return this.service.listManualReview();}
 @Roles("admin") @Get("admin/artifacts/:artifactId") @Header("Cache-Control","no-store") async artifact(@Param("artifactId") artifactId:string){const item=await this.service.getArtifactForAdmin(artifactId);return new StreamableFile(item.buffer,{type:item.mimeType,length:item.bytes});}
 @Roles("admin") @Post("review/:userId") review(@Param("userId") userId:string,@Body() dto:ReviewDto){return this.service.review(userId,dto.approved);}
}