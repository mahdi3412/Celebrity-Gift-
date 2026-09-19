import {Inject,Injectable} from "@nestjs/common";
import {CourierProvider,COURIER_PROVIDER} from "./courier.provider";
import {DatabaseService} from "../database/database.service";
@Injectable()
export class CourierService{
 constructor(@Inject(COURIER_PROVIDER) private readonly provider:CourierProvider,private readonly db:DatabaseService){}
 async quote(userId:string,destinationPincode?:string,giftId?:string){const quote=await this.provider.quote({destinationPincode});await this.db.query("INSERT INTO courier_quotes(user_id,gift_id,fan_to_station_inr,station_to_creator_inr,provider,destination_pincode) VALUES($1,$2,$3,$4,$5,$6)",[userId,giftId??null,quote.fanToStationInr,quote.stationToCreatorInr,quote.provider,quote.destinationPincode??null]);return {...quote,totalInr:quote.fanToStationInr+quote.stationToCreatorInr};}
}