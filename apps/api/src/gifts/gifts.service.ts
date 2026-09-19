import {BadRequestException,ForbiddenException,Injectable} from "@nestjs/common";
import {Role} from "../auth/auth.constants";
export type GiftStatus="REQUESTED"|"RECEIVED_AT_STATION"|"PROCESSING"|"SHIPPED"|"DELIVERED"|"ACCEPTED"|"DECLINED"|"RETURNED";
export type Gift={id:string;fanId:string;creatorId:string;category:string;status:GiftStatus;food:boolean;fragile:boolean;createdAt:string};
@Injectable()
export class GiftsService{
 private gifts=new Map<string,Gift>();
 create(input:{fanId:string;creatorId:string;category:string;food?:boolean;fragile?:boolean}){
  if(!input.fanId||!input.creatorId||!input.category)throw new BadRequestException("creatorId and category are required");
  const id="GFT-"+String(this.gifts.size+184).padStart(6,"0");
  const gift={id,fanId:input.fanId,creatorId:input.creatorId,category:input.category,status:"REQUESTED" as GiftStatus,food:Boolean(input.food),fragile:Boolean(input.fragile),createdAt:new Date().toISOString()};
  this.gifts.set(id,gift);return {...gift,qrPayload:"celebrity-gift://"+id};
 }
 getForUser(id:string,userId:string,role:Role){
  const gift=this.gifts.get(id);if(!gift)return undefined;
  if(role!=="admin"&&role!=="station_staff"&&gift.fanId!==userId&&gift.creatorId!==userId)throw new ForbiddenException("Gift access denied");
  return gift;
 }
 transitionForUser(id:string,status:GiftStatus,userId:string,role:Role){
  const gift=this.gifts.get(id);if(!gift)throw new BadRequestException("Gift not found");
  const stationStatuses:GiftStatus[]=["RECEIVED_AT_STATION","PROCESSING","SHIPPED","DELIVERED"];
  const creatorStatuses:GiftStatus[]=["ACCEPTED","DECLINED","RETURNED"];
  const allowed=role==="admin"||(role==="station_staff"&&stationStatuses.includes(status))||(role==="creator"&&gift.creatorId===userId&&creatorStatuses.includes(status));
  if(!allowed)throw new ForbiddenException("Status transition not allowed");
  gift.status=status;this.gifts.set(id,gift);return gift;
 }
 get(id:string){return this.gifts.get(id);}
 transition(id:string,status:GiftStatus){const gift=this.gifts.get(id);if(!gift)throw new BadRequestException("Gift not found");gift.status=status;this.gifts.set(id,gift);return gift;}
}