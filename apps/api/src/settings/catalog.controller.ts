import {Controller,Get} from "@nestjs/common";
import {Public} from "../auth/public.decorator";
import {PlatformSettingsService} from "./settings.service";
@Controller("catalog")
export class CatalogController{
 constructor(private readonly service:PlatformSettingsService){}
 @Public()@Get() async get(){const s=await this.service.get();return {giftCategories:s.giftCategories,verificationDocumentTypes:s.verificationDocumentTypes};}
}