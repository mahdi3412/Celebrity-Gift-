import {Module} from "@nestjs/common";
import {CreatorsController} from "./creators.controller";
import {CreatorsService} from "./creators.service";
import {CreatorInterestController} from "./creator-interest.controller";
import {CreatorInterestService} from "./creator-interest.service";
import {ThresholdsModule} from "../thresholds/thresholds.module";
@Module({imports:[ThresholdsModule],controllers:[CreatorsController,CreatorInterestController],providers:[CreatorsService,CreatorInterestService],exports:[CreatorsService,CreatorInterestService]})
export class CreatorsModule{}