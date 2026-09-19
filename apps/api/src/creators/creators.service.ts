import {ConflictException,Injectable,NotFoundException} from "@nestjs/common";
import {DatabaseService} from "../database/database.service";
export type Creator={id:string;displayName:string;handle:string;category:string|null;uniqueFans:number;totalRequests:number};
@Injectable()
export class CreatorsService{
 constructor(private readonly db:DatabaseService){}
 async findAll(search=""){
  const q=search.trim();
  const result=await this.db.query<Creator>("SELECT cp.user_id AS id,cp.display_name AS \"displayName\",cp.handle,cp.category,COUNT(DISTINCT g.fan_id)::int AS \"uniqueFans\",COUNT(g.id)::int AS \"totalRequests\" FROM creator_profiles cp JOIN users u ON u.id=cp.user_id LEFT JOIN gifts g ON g.creator_id=cp.user_id WHERE u.role='creator' AND cp.is_public=true AND ($1='' OR cp.display_name ILIKE '%'||$1||'%' OR cp.handle ILIKE '%'||$1||'%') GROUP BY cp.user_id,cp.display_name,cp.handle,cp.category ORDER BY \"uniqueFans\" DESC,cp.display_name ASC LIMIT 50",[q]);
  return result.rows.map(c=>this.publicView(c));
 }
 async findOne(idOrHandle:string){
  const normalized=idOrHandle.startsWith("@")?idOrHandle.slice(1):idOrHandle;
  const result=await this.db.query<Creator>("SELECT cp.user_id AS id,cp.display_name AS \"displayName\",cp.handle,cp.category,COUNT(DISTINCT g.fan_id)::int AS \"uniqueFans\",COUNT(g.id)::int AS \"totalRequests\" FROM creator_profiles cp JOIN users u ON u.id=cp.user_id LEFT JOIN gifts g ON g.creator_id=cp.user_id WHERE u.role='creator' AND cp.is_public=true AND (cp.user_id=$1 OR cp.handle=$2) GROUP BY cp.user_id,cp.display_name,cp.handle,cp.category LIMIT 1",[normalized,normalized]);
  return result.rows[0];
 }
 async updateProfile(userId:string,input:{displayName:string;handle:string;category?:string;publicBio?:string}){
  const result=await this.db.query<Creator>("INSERT INTO creator_profiles(user_id,display_name,handle,category,public_bio,is_public) VALUES($1,$2,$3,$4,$5,true) ON CONFLICT (user_id) DO UPDATE SET display_name=EXCLUDED.display_name,handle=EXCLUDED.handle,category=EXCLUDED.category,public_bio=EXCLUDED.public_bio RETURNING user_id AS id,display_name AS \"displayName\",handle,category",[userId,input.displayName.trim(),input.handle.replace(/^@/,"").trim().toLowerCase(),input.category?.trim()||null,input.publicBio?.trim()||null]);
  if(!result.rowCount)throw new NotFoundException("Creator profile not found");
  return result.rows[0];
 }
 private publicView(c:Creator){return {id:c.id,displayName:c.displayName,handle:c.handle,category:c.category,interestIndicator:c.uniqueFans>=150?"دعوت به عضویت پیشنهاد می‌شود":c.uniqueFans>=100?"علاقه عمومی قابل توجه":undefined};}
}