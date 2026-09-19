import {Injectable} from "@nestjs/common";
import {DatabaseService} from "../database/database.service";
@Injectable()
export class AuditService{
 constructor(private readonly db:DatabaseService){}
 async record(input:{actorId?:string|null;action:string;entityType?:string;entityId?:string;metadata?:Record<string,unknown>}){
  await this.db.query("INSERT INTO audit_logs(actor_id,action,entity_type,entity_id,metadata) VALUES($1,$2,$3,$4,$5)",[input.actorId??null,input.action,input.entityType??null,input.entityId??null,JSON.stringify(input.metadata??{})]);
 }
}