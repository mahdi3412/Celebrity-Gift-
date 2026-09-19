import {Global,Module} from "@nestjs/common";
import {CourierController} from "./courier.controller";
import {CourierService} from "./courier.service";
import {ManualCourierProvider} from "./manual-courier.provider";
import {COURIER_PROVIDER} from "./courier.provider";
@Global()@Module({controllers:[CourierController],providers:[CourierService,ManualCourierProvider,{provide:COURIER_PROVIDER,useExisting:ManualCourierProvider}],exports:[CourierService]})
export class CourierModule{}