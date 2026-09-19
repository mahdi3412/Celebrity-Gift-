import {Body,Controller,Get,Patch} from "@nestjs/common";
import {IsArray,IsInt,IsOptional,IsString,Max,MaxLength,Min,MinLength} from "class-validator";
import {Roles} from "../auth/roles.decorator";
import {PlatformSettingsService} from "./settings.service";
class SettingsDto{
 @IsOptional()@IsArray()@IsString({each:true})@MinLength(2,{each:true})@MaxLength(40,{each:true}) giftCategories?:string[];
 @IsOptional()@IsArray()@IsString({each:true})@MinLength(2,{each:true})@MaxLength(40,{each:true}) verificationDocumentTypes?:string[];
 @IsOptional()@IsInt()@Min(1)@Max(20) verificationMaxAttempts?:number;
 @IsOptional()@IsInt()@Min(1)@Max(1440) verificationAttemptWindowMinutes?:number;
 @IsOptional()@IsInt()@Min(1)@Max(3650) kycRetentionDays?:number;
}
@Controller("settings")@Roles("admin")
export class SettingsController{constructor(private readonly service:PlatformSettingsService){}@Get() get(){return this.service.get();}@Patch() update(@Body() dto:SettingsDto){return this.service.update(dto);}}
