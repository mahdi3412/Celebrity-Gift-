import {Global,Module} from "@nestjs/common";
import {PlatformSettingsService} from "./settings.service";
import {CatalogController} from "./catalog.controller";
import {SettingsController} from "./settings.controller";
@Global()
@Module({controllers:[CatalogController,SettingsController],providers:[PlatformSettingsService],exports:[PlatformSettingsService]})
export class SettingsModule{}