import {BadRequestException,ForbiddenException,Injectable,NotFoundException} from "@nestjs/common";
import {randomUUID} from "crypto";
import {DatabaseService} from "../database/database.service";
import {Role} from "../auth/auth.constants";
import {NotificationsService} from "../notifications/notifications.service";
import {ThresholdsService} from "../thresholds/thresholds.service";
export type GiftStatus="REQUESTED"|"RECEIVED_AT_STATION"|"PROCESSING"|"SHIPPED"|"DELIVERED"|"ACCEPTED"|"DECLINED"|"RETURNED";
export type Gift={id:string;giftCode:string;fanId:string;creatorId:string;category:string;status:GiftStatus;food:boolean;fragile:boolean;noteDeclared:boolean;createdAt:string;foodExpiryAt:string|null;stationReceivedAt:string|null;stationInspectionStatus:string;stationNotes:string|null};
const transitions:Record<GiftStatus,GiftStatus[]>={REQUESTED:["RECEIVED_AT_STATION"],RECEIVED_AT_STATION:["PROCESSING"],PROCESSING:["SHIPPED"],SHIPPED:["DELIVERED"],DELIVERED:["ACCEPTED","DECLINED","RETURNED"],ACCEPTED:[],DECLINED:["RETURNED"],RETURNED:[]};
@Injectable()
export class GiftsService{
 constructor(private readonly db:DatabaseService,private readonly notifications:NotificationsService,private readonly thresholds:ThresholdsService){}
 async create(input:{fanId:string;creatorId:string;category:string;food?:boolean;fragile?:boolean;noteDeclared?:boolean;foodExpiryAt?:string}){
  if(!input.fanId||!input.creatorId||!input.category)throw new BadRequestException("creatorId and category are required");
  if(input.food && !input.foodExpiryAt)throw new BadRequestException("Food gifts require expiry date");
  if(input.food&&input.foodExpiryAt&&new Date(input.foodExpiryAt).getTime()<=Date.now())throw new BadRequestException("Food expiry must be in the future");
  const creator=await this.db.query("SELECT id FROM users WHERE id=$1 AND role='creator'",[input.creatorId]);
  if(!creator.rowCount)throw new BadRequestException("Creator not found");
  const verified=await this.db.query("SELECT 1 FROM verifications WHERE user_id=$1 AND status='AUTO_VERIFIED' ORDER BY created_at DESC LIMIT 1",[input.fanId]);
  if(!verified.rowCount)throw new ForbiddenException("Fan verification is required");
  const creatorVerified=await this.db.query("SELECT 1 FROM verifications WHERE user_id=$1 AND status='AUTO_VERIFIED' ORDER BY created_at DESC LIMIT 1",[input.creatorId]);
  if(!creatorVerified.rowCount)throw new BadRequestException("Creator is not verified");
  const config=await this.thresholds.get();
  const cap=await this.db.query<{count:string}>("SELECT COUNT(*)::text AS count FROM gifts WHERE fan_id=$1 AND creator_id=$2",[input.fanId,input.creatorId]);
  if(Number(cap.rows[0]?.count??0)>=config.maxUniqueRequestsPerFan)throw new BadRequestException("Maximum gift request limit reached for this creator");
  const code=(await this.db.query<{nextval:string}>("SELECT nextval('gift_code_seq')::text AS nextval")).rows[0].nextval;
  const result=await this.db.query<Gift>("INSERT INTO gifts(id,gift_code,fan_id,creator_id,category,note_declared,food_declared,fragile_declared,food_expiry_at) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING id,gift_code AS \"giftCode\",fan_id AS \"fanId\",creator_id AS \"creatorId\",category,status,food_declared AS food,fragile_declared AS fragile,note_declared AS \"noteDeclared\",created_at AS \"createdAt\"",[randomUUID(),"GFT-"+String(code).padStart(6,"0"),input.fanId,input.creatorId,input.category,Boolean(input.noteDeclared),Boolean(input.food),Boolean(input.fragile),input.foodExpiryAt?new Date(input.foodExpiryAt):null]);
  const gift=result.rows[0];
  await this.notifications.create({userId:gift.creatorId,type:"GIFT_REQUEST",title:"درخواست هدیه جدید",body:"یک درخواست هدیه برای شما ثبت شده است.",entityType:"gift",entityId:gift.id});
  const metrics=await this.db.query<{uniqueFans:number,totalRequests:number}>("SELECT COUNT(DISTINCT fan_id)::int AS \"uniqueFans\",COUNT(*)::int AS \"totalRequests\" FROM gifts WHERE creator_id=$1",[gift.creatorId]);
  const thresholdsConfig=await this.thresholds.get();const uniqueFans=metrics.rows[0]?.uniqueFans??0;
  if(uniqueFans===thresholdsConfig.publicInterest||uniqueFans===thresholdsConfig.strongInvite{await this.notifications.create({userId:gift.creatorId,type:"THRESHOLD_REACHED",title:"رسیدن به آستانه علاقه",body:"تعداد طرفداران یکتای علاقه‌مند به شما به یکی از آستانه‌های تعریف‌شده رسید.",entityType:"creator",entityId:gift.creatorId});}
  return {...gift,qrPayload:"celebrity-gift://"+gift.giftCode};
 }
 async getForUser(id:string,userId:string,role:Role){
  const result=await this.db.query<Gift>("SELECT id,gift_code AS \"giftCode\",fan_id AS \"fanId\",creator_id AS \"creatorId\",category,status,food_declared AS food,fragile_declared AS fragile,note_declared AS \"noteDeclared\",created_at AS \"createdAt\",food_expiry_at AS \"foodExpiryAt\",station_received_at AS \"stationReceivedAt\",station_inspection_status AS \"stationInspectionStatus\",station_notes AS \"stationNotes\" FROM gifts WHERE id::text=$1 OR gift_code=$1 LIMIT 1",[id]);
  const gift=result.rows[0];if(!gift)return undefined;
  if(role!=="admin"&&role!=="station_staff"&&gift.fanId!==userId&&gift.creatorId!==userId)throw new ForbiddenException("Gift access denied");
  return {...gift,qrPayload:"celebrity-gift://"+gift.giftCode};
 }
 async transitionForUser(id:string,status:GiftStatus,userId:string,role:Role){
  const result=await this.db.query<Gift>("SELECT id,gift_code AS \"giftCode\",fan_id AS \"fanId\",creator_id AS \"creatorId\",category,status,food_declared AS food,fragile_declared AS fragile,note_declared AS \"noteDeclared\",created_at AS \"createdAt\" FROM gifts WHERE id::text=$1 OR gift_code=$1 LIMIT 1",[id]);
  const gift=result.rows[0];if(!gift)throw new NotFoundException("Gift not found");
  const stationStatuses:GiftStatus[]=["RECEIVED_AT_STATION","PROCESSING","SHIPPED","DELIVERED"];
  const creatorStatuses:GiftStatus[]=["ACCEPTED","DECLINED","RETURNED"];
  const allowed=role==="admin"||(role==="station_staff"&&stationStatuses.includes(status))||(role==="creator"&&gift.creatorId===userId&&creatorStatuses.includes(status));
  if(!allowed)throw new ForbiddenException("Status transition not allowed");
  if(!transitions[gift.status].includes(status))throw new BadRequestException("Invalid transition: "+gift.status+" -> "+status);
  const updated=await this.db.query<Gift>("UPDATE gifts SET status=$1,station_received_at=CASE WHEN $1='RECEIVED_AT_STATION' AND station_received_at IS NULL THEN now() ELSE station_received_at END,updated_at=now() WHERE id=$2 RETURNING id,gift_code AS \"giftCode\",fan_id AS \"fanId\",creator_id AS \"creatorId\",category,status,food_declared AS food,fragile_declared AS fragile,note_declared AS \"noteDeclared\",created_at AS \"createdAt\"",[status,gift.id]);
  const nextGift=updated.rows[0];await this.notifications.create({userId:nextGift.creatorId,type:"GIFT_STATUS",title:"به‌روزرسانی وضعیت هدیه",body:"وضعیت هدیه به "+nextGift.status+" تغییر کرد.",entityType:"gift",entityId:nextGift.id});if(nextGift.fanId!==nextGift.creatorId){await this.notifications.create({userId:nextGift.fanId,type:"GIFT_STATUS",title:"به‌روزرسانی هدیه",body:"وضعیت هدیه شما به "+nextGift.status+" تغییر کرد.",entityType:"gift",entityId:nextGift.id});}return nextGift;
 }
 async get(id:string){const r=await this.db.query<Gift>("SELECT id,gift_code AS \"giftCode\",fan_id AS \"fanId\",creator_id AS \"creatorId\",category,status,food_declared AS food,fragile_declared AS fragile,note_declared AS \"noteDeclared\",created_at AS \"createdAt\",food_expiry_at AS \"foodExpiryAt\",station_received_at AS \"stationReceivedAt\",station_inspection_status AS \"stationInspectionStatus\",station_notes AS \"stationNotes\" FROM gifts WHERE id::text=$1 OR gift_code=$1 LIMIT 1",[id]);return r.rows[0];}
 async transition(id:string,status:GiftStatus){const r=await this.db.query<Gift>("UPDATE gifts SET status=$1,updated_at=now() WHERE id=$2 RETURNING *",[status,id]);if(!r.rowCount)throw new NotFoundException("Gift not found");return r.rows[0];}
}