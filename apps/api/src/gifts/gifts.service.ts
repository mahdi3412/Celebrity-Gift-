import {BadRequestException,ForbiddenException,Injectable,NotFoundException} from "@nestjs/common";
import {randomUUID} from "crypto";
import {DatabaseService} from "../database/database.service";
import {Role} from "../auth/auth.constants";
export type GiftStatus="REQUESTED"|"RECEIVED_AT_STATION"|"PROCESSING"|"SHIPPED"|"DELIVERED"|"ACCEPTED"|"DECLINED"|"RETURNED";
export type Gift={id:string;giftCode:string;fanId:string;creatorId:string;category:string;status:GiftStatus;food:boolean;fragile:boolean;noteDeclared:boolean;createdAt:string};
const transitions:Record<GiftStatus,GiftStatus[]>={REQUESTED:["RECEIVED_AT_STATION"],RECEIVED_AT_STATION:["PROCESSING"],PROCESSING:["SHIPPED"],SHIPPED:["DELIVERED"],DELIVERED:["ACCEPTED","DECLINED","RETURNED"],ACCEPTED:[],DECLINED:["RETURNED"],RETURNED:[]};
@Injectable()
export class GiftsService{
 constructor(private readonly db:DatabaseService){}
 async create(input:{fanId:string;creatorId:string;category:string;food?:boolean;fragile?:boolean;noteDeclared?:boolean}){
  if(!input.fanId||!input.creatorId||!input.category)throw new BadRequestException("creatorId and category are required");
  const creator=await this.db.query("SELECT id FROM users WHERE id=$1 AND role='creator'",[input.creatorId]);
  if(!creator.rowCount)throw new BadRequestException("Creator not found");
  const code=(await this.db.query<{nextval:string}>("SELECT nextval('gift_code_seq')::text AS nextval")).rows[0].nextval;
  const result=await this.db.query<Gift>("INSERT INTO gifts(id,gift_code,fan_id,creator_id,category,note_declared,food_declared,fragile_declared) VALUES($1,$2,$3,$4,$5,$6,$7,$8) RETURNING id,gift_code AS \"giftCode\",fan_id AS \"fanId\",creator_id AS \"creatorId\",category,status,food_declared AS food,fragile_declared AS fragile,note_declared AS \"noteDeclared\",created_at AS \"createdAt\"",[randomUUID(),"GFT-"+String(code).padStart(6,"0"),input.fanId,input.creatorId,input.category,Boolean(input.noteDeclared),Boolean(input.food),Boolean(input.fragile)]);
  const gift=result.rows[0];return {...gift,qrPayload:"celebrity-gift://"+gift.giftCode};
 }
 async getForUser(id:string,userId:string,role:Role){
  const result=await this.db.query<Gift>("SELECT id,gift_code AS \"giftCode\",fan_id AS \"fanId\",creator_id AS \"creatorId\",category,status,food_declared AS food,fragile_declared AS fragile,note_declared AS \"noteDeclared\",created_at AS \"createdAt\" FROM gifts WHERE id::text=$1 OR gift_code=$1 LIMIT 1",[id]);
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
  const updated=await this.db.query<Gift>("UPDATE gifts SET status=$1,updated_at=now() WHERE id=$2 RETURNING id,gift_code AS \"giftCode\",fan_id AS \"fanId\",creator_id AS \"creatorId\",category,status,food_declared AS food,fragile_declared AS fragile,note_declared AS \"noteDeclared\",created_at AS \"createdAt\"",[status,gift.id]);
  return updated.rows[0];
 }
 async get(id:string){const r=await this.db.query<Gift>("SELECT id,gift_code AS \"giftCode\",fan_id AS \"fanId\",creator_id AS \"creatorId\",category,status,food_declared AS food,fragile_declared AS fragile,note_declared AS \"noteDeclared\",created_at AS \"createdAt\" FROM gifts WHERE id::text=$1 OR gift_code=$1 LIMIT 1",[id]);return r.rows[0];}
 async transition(id:string,status:GiftStatus){const r=await this.db.query<Gift>("UPDATE gifts SET status=$1,updated_at=now() WHERE id=$2 RETURNING *",[status,id]);if(!r.rowCount)throw new NotFoundException("Gift not found");return r.rows[0];}
}