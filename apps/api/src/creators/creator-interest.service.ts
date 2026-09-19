import {BadRequestException,Injectable} from "@nestjs/common";
import {DatabaseService} from "../database/database.service";
import {ThresholdsService} from "../thresholds/thresholds.service";

@Injectable()
export class CreatorInterestService{
 constructor(private readonly db:DatabaseService,private readonly thresholds:ThresholdsService){}
 async register(fanId:string,input:{handle:string;displayName:string;category?:string}){
  const handle=input.handle.replace(/^@/,"").trim().toLowerCase();
  if(!/^[a-z0-9_]{3,30}$/.test(handle))throw new BadRequestException("Invalid creator handle");
  if(!input.displayName?.trim())throw new BadRequestException("displayName is required");
  return this.db.transaction(async client=>{
   const target=(await client.query("INSERT INTO creator_targets(handle,display_name,category) VALUES($1,$2,$3) ON CONFLICT(handle) DO UPDATE SET display_name=EXCLUDED.display_name,category=COALESCE(EXCLUDED.category,creator_targets.category) RETURNING id,handle,display_name AS "displayName",category",[handle,input.displayName.trim(),input.category?.trim()||null])).rows[0];
   const inserted=(await client.query("INSERT INTO creator_interest_events(creator_target_id,fan_id) VALUES($1,$2) ON CONFLICT(creator_target_id,fan_id) DO NOTHING RETURNING id",[target.id,fanId])).rowCount>0;
   await client.query("INSERT INTO creator_activity_events(creator_target_id,fan_id,event_type,source) VALUES($1,$2,'INTEREST_REQUEST','DISCOVER')",[target.id,fanId]);
   const metrics=(await client.query("SELECT COUNT(DISTINCT fan_id)::int AS "uniqueFans",COUNT(*)::int AS "totalRequests" FROM creator_activity_events WHERE creator_target_id=$1",[target.id])).rows[0];
   const thresholds=await this.thresholds.get();
   if(inserted&&(Number(metrics.uniqueFans)===thresholds.publicInterest||Number(metrics.uniqueFans)===thresholds.strongInvite)){
    await client.query("INSERT INTO creator_invitations(creator_target_id,triggered_by,channel) VALUES($1,$2,'MANUAL')",[target.id,fanId]);
   }
   return {...target,uniqueFans:Number(metrics.uniqueFans),totalRequests:Number(metrics.totalRequests),created:inserted};
  });
 }
 async list(search=""){
  const result=await this.db.query("SELECT t.id,t.handle,t.display_name AS "displayName",t.category,COUNT(DISTINCT e.fan_id)::int AS "uniqueFans",COUNT(a.id)::int AS "totalRequests" FROM creator_targets t LEFT JOIN creator_interest_events e ON e.creator_target_id=t.id LEFT JOIN creator_activity_events a ON a.creator_target_id=t.id WHERE ($1='' OR t.display_name ILIKE '%'||$1||'%' OR t.handle ILIKE '%'||$1||'%') GROUP BY t.id,t.handle,t.display_name,t.category ORDER BY "uniqueFans" DESC,t.display_name ASC LIMIT 50",[search.trim()]);
  const thresholds=await this.thresholds.get();
  return result.rows.map((x:any)=>({id:x.id,handle:x.handle,displayName:x.displayName,category:x.category,isMember:false,uniqueFans:x.uniqueFans,totalRequests:x.totalRequests,interestIndicator:x.uniqueFans>=thresholds.strongInvite?"دعوت به عضویت پیشنهاد می‌شود":x.uniqueFans>=thresholds.publicInterest?"علاقه عمومی قابل توجه":undefined}));
 }
}
