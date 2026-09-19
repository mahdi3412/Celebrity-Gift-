import {Injectable} from "@nestjs/common";
import {CourierProvider} from "./courier.provider";
@Injectable()
export class ManualCourierProvider implements CourierProvider{
 async quote(input:{destinationPincode?:string}){return {provider:"manual",fanToStationInr:Number(process.env.COURIER_FAN_TO_STATION_INR??120),stationToCreatorInr:Number(process.env.COURIER_STATION_TO_CREATOR_INR??180),currency:"INR" as const,destinationPincode:input.destinationPincode,note:"قیمت اولیه دستی؛ اتصال به API پیک در نسخه عملیاتی قابل تعویض است."};}
}