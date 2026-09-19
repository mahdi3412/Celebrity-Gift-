import {Module} from "@nestjs/common";
import {StationController} from "./station.controller";
import {StationService} from "./station.service";
import {CreatorsModule} from "../creators/creators.module";
@Module({imports:[CreatorsModule],controllers:[StationController],providers:[StationService],exports:[StationService]})
export class StationModule{}