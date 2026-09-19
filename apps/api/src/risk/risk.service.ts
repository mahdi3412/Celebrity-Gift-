import {Injectable} from "@nestjs/common";
import {DatabaseService} from "../database/database.service";
@Injectable()
export class RiskService{
 constructor(private readonly db:DatabaseService){}
 async flag(input:{userId?:string|null;entityType?:string;entityId?:string;riskType:string;severity:"LOW"|"MEDIUM"|"HIGH"|"CRITICAL";reason:string;metadata?:Record<string,unknown>}){const r=await this.db.query("INSERT INTO risk_events(user_id,entity_type,entity_id,risk_type,severity,reason,metadata) VALUES($1,$2,$3,$4,$5,$6,$7::jsonb) RETURNING id,created_at AS \"createdAt\"",[input.userId??null,input.entityType??null,input.entityId??null,input.riskType,input.severity,input.reason,JSON.stringify(input.metadata??{})]);return r.rows[0];}
 async list(){const r=await this.db.query("SELECT id,user_id AS \"userId\",entity_type AS \"entityType\",entity_id AS \"entityId\",risk_type AS \"riskType\",severity,reason,metadata,created_at AS \"createdAt\",resolved_at AS \"resolvedAt\",resolved_by AS \"resolvedBy\" FROM risk_events WHERE resolved_at IS NULL ORDER BY CASE severity WHEN 'CRITICAL' THEN 1 WHEN 'HIGH' THEN 2 WHEN 'MEDIUM' THEN 3 ELSE 4 END,created_at ASC LIMIT 200");return r.rows;}
 async resolve(id:string,adminId:string){const r=await this.db.query("UPDATE risk_events SET resolved_at=now(),resolved_by=$1 WHERE id=$2 AND resolved_at IS NULL RETURNING id,resolved_at AS \"resolvedAt\"",[adminId,id]);return r.rows[0]??null;}
}