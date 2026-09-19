import {BadRequestException,Injectable} from "@nestjs/common";
export type GiftStatus="REQUESTED"|"RECEIVED_AT_STATION"|"PROCESSING"|"SHIPPED"|"DELIVERED"|"ACCEPTED"|"DECLINED"|"RETURNED";
export type Gift={id:string;creatorId:string;category:string;status:GiftStatus;food:boolean;fragile:boolean;createdAt:string};
@Injectable() export class GiftsService {
  private gifts=new Map<string,Gift>();
  create(input:{creatorId:string;category:string;food?:boolean;fragile?:boolean}){
    if(!input.creatorId||!input.category) throw new BadRequestException("creatorId and category are required");
    const id="GFT-"+String(this.gifts.size+184).padStart(6,"0");
    const gift={id,creatorId:input.creatorId,category:input.category,status:"REQUESTED" as GiftStatus,food:Boolean(input.food),fragile:Boolean(input.fragile),createdAt:new Date().toISOString()};
    this.gifts.set(id,gift);
    return {...gift,qrPayload:"celebrity-gift://"+id};
  }
  get(id:string){return this.gifts.get(id);}
  transition(id:string,status:GiftStatus){
    const gift=this.gifts.get(id);
    if(!gift) throw new BadRequestException("Gift not found");
    gift.status=status; this.gifts.set(id,gift); return gift;
  }
}