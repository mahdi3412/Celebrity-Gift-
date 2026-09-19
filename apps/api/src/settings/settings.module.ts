import {Global,Module} from "@nestjs/common";
import {PlatformSettingsService} from "./settings.service";
import {CatalogController} from "./catalog.controller";
@Global()@Module({providers:[PlatformSettingsService],exports:[PlatformSettingsService]})
export class SettingsModule{}