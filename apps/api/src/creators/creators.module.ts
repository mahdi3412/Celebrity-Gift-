import {Module} from "@nestjs/common";
import {CreatorsController} from "./creators.controller";
import {CreatorsService} from "./creators.service";
import {ThresholdsModule} from "../thresholds/thresholds.module";
@Module({imports:[ThresholdsModule],controllers:[CreatorsController],providers:[CreatorsService],exports:[CreatorsService]})
export class CreatorsModule{}