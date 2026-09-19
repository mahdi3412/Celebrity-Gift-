import {Injectable,NotFoundException} from "@nestjs/common";
import {randomUUID} from "crypto";
import {DatabaseService} from "../database/database.service";
export type Notification={id:string;type:string;title:string;body:string;entityType:string|null;entityId:string|null;readAt:string|null;createdAt:string};
@Injectable()
export class NotificationsService{
 constructor(private readonly db:DatabaseService){}
 async create(input:{userId:string;type:string;title:string;body:string;entityType?:string;entityId?:string}){const r=await this.db.query<Notification>("INSERT INTO notifications(id,user_id,type,title,body,entity_type,entity_id) VALUES($1,$2,$3,$4,$5,$6,$7) RETURNING id,type,title,body,entity_type AS \"entityType\",entity_id AS \"entityId\",read_at AS \"readAt\",created_at AS \"createdAt\"",[randomUUID(),input.userId,input.type,input.title,input.body,input.entityType??null,input.entityId??null]);return r.rows[0];}
 async listForUser(userId:string){const r=await this.db.query<Notification>("SELECT id,type,title,body,entity_type AS \"entityType\",entity_id AS \"entityId\",read_at AS \"readAt\",created_at AS \"createdAt\" FROM notifications WHERE user_id=$1 ORDER BY created_at DESC LIMIT 100",[userId]);return r.rows;}
 async markRead(userId:string,id:string){const r=await this.db.query<Notification>("UPDATE notifications SET read_at=COALESCE(read_at,now()) WHERE id=$1 AND user_id=$2 RETURNING id,type,title,body,entity_type AS \"entityType\",entity_id AS \"entityId\",read_at AS \"readAt\",created_at AS \"createdAt\"",[id,userId]);if(!r.rowCount)throw new NotFoundException("Notification not found");return r.rows[0];}
}