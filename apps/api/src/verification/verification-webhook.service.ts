import {Injectable,UnauthorizedException} from "@nestjs/common";
import {createHmac,timingSafeEqual} from "crypto";
import {DatabaseService} from "../database/database.service";
import {NotificationsService} from "../notifications/notifications.service";
import {AuditService} from "../audit/audit.service";
import type {VerificationStatus} from "./verification.service";

type ProviderEvent={eventId:string;eventType?:string;providerReference?:string;status?:VerificationStatus;userId?:string};

@Injectable()
export class VerificationWebhookService{
 constructor(private readonly db:DatabaseService,private readonly notifications:NotificationsService,private readonly audit:AuditService){}
 verify(raw:Buffer,signature:string){
  const secret=process.env.KYC_WEBHOOK_SECRET??"";
  if(!secret)throw new UnauthorizedException("Webhook secret is not configured");
  const expected=createHmac("sha256",secret).update(raw).digest("hex");
  const a=Buffer.from(signature,"hex");const b=Buffer.from(expected,"hex");
  if(a.length!==b.length||!timingSafeEqual(a,b))throw new UnauthorizedException("Invalid webhook signature");
 }
 async handle(provider:string,raw:Buffer,signature:string){
  this.verify(raw,signature);
  let event:ProviderEvent;try{event=JSON.parse(raw.toString("utf8"));}catch{throw new UnauthorizedException("Invalid webhook payload");}
  if(!event.eventId)throw new UnauthorizedException("Missing eventId");
  const inserted=await this.db.query<{id:string}>(
   "INSERT INTO provider_webhook_events(provider,event_id,event_type) VALUES($1,$2,$3) ON CONFLICT(provider,event_id) DO NOTHING RETURNING id",
   [provider,event.eventId,event.eventType??null]
  );
  if(!inserted.rowCount)return {ok:true,duplicate:true};
  const mapped=event.status; if(!mapped||!["NOT_STARTED","SUBMITTED","AUTO_VERIFIED","MANUAL_REVIEW","FAILED","RESUBMIT"].includes(mapped)){await this.db.query("UPDATE provider_webhook_events SET processed_at=now() WHERE id=$1",[inserted.rows[0].id]);return {ok:true,ignored:true};}
  const updated=event.providerReference
    ? await this.db.query<{user_id:string,id:string}>("UPDATE verifications SET status=$1,reviewed_at=CASE WHEN $1 IN ('AUTO_VERIFIED','FAILED','RESUBMIT') THEN now() ELSE reviewed_at END WHERE provider_reference=$2 RETURNING user_id,id",[mapped,event.providerReference])
    : await this.db.query<{user_id:string,id:string}>("UPDATE verifications SET status=$1,reviewed_at=CASE WHEN $1 IN ('AUTO_VERIFIED','FAILED','RESUBMIT') THEN now() ELSE reviewed_at END WHERE id=(SELECT id FROM verifications WHERE user_id=$2 ORDER BY created_at DESC LIMIT 1) RETURNING user_id,id",[mapped,event.userId]);
  await this.db.query("UPDATE provider_webhook_events SET processed_at=now() WHERE id=$1",[inserted.rows[0].id]);
  if(updated.rowCount){const userId=updated.rows[0].user_id;await this.notifications.create({userId,type:"VERIFICATION_WEBHOOK",title:"به‌روزرسانی احراز هویت",body:"وضعیت احراز هویت شما به "+mapped+" تغییر کرد.",entityType:"verification",entityId:updated.rows[0].id});await this.audit.record({actorId:null,action:"KYC_WEBHOOK_PROCESSED",entityType:"verification",entityId:updated.rows[0].id,metadata:{provider,eventId:event.eventId,status:mapped}});}
  return {ok:true,updated:Boolean(updated.rowCount)};
 }
}
