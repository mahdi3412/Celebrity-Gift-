import {Module} from "@nestjs/common";
import {CreatorsController} from "./creators.controller";
import {CreatorsService} from "./creators.service";
import {CreatorInterestController} from "./creator-interest.controller";
import {CreatorInterestService} from "./creator-interest.service";
import {ThresholdsModule} from "../thresholds/thresholds.module";
import {PrivacyModule} from "../privacy/privacy.module";
import {CreatorPrivateAddressController} from "./creator-private-address.controller";
import {CreatorPrivateAddressService} from "./creator-private-address.service";
@Module({imports:[ThresholdsModule,PrivacyModule],controllers:[CreatorsController,CreatorInterestController,CreatorPrivateAddressController],providers:[CreatorsService,CreatorInterestService,CreatorPrivateAddressService],exports:[CreatorsService,CreatorInterestService]})
export class CreatorsModule{}