import {BadRequestException,Injectable} from "@nestjs/common";
import {GiftsService,GiftStatus} from "../gifts/gifts.service";
@Injectable()
export class StationService{
 constructor(private readonly gifts:GiftsService){}
 async scan(giftId:string){const gift=await this.gifts.get(giftId);if(!gift)throw new BadRequestException("Gift not found");return {giftId:gift.giftCode,verifiedCreatorMapping:true,status:gift.status,foodPriority:gift.food,fragile:gift.fragile,sop:"Inspect external packaging and declarations; do not normally open sealed packages."};}
 async updateStatus(giftId:string,status:GiftStatus){return this.gifts.transition(giftId,status);}
}