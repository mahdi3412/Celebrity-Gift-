import {Injectable} from "@nestjs/common";
import {DatabaseService} from "../database/database.service";
import {AuditService} from "../audit/audit.service";
@Injectable()
export class AdminService{
 constructor(private readonly db:DatabaseService,private readonly audit:AuditService){}
 async stats(){const [users,gifts,verifications,targets]=await Promise.all([
  this.db.query("SELECT role,COUNT(*)::int AS count FROM users GROUP BY role"),
  this.db.query("SELECT status,COUNT(*)::int AS count FROM gifts GROUP BY status"),
  this.db.query("SELECT status,COUNT(*)::int AS count FROM verifications GROUP BY status"),
  this.db.query("SELECT COUNT(*)::int AS count FROM creator_targets")
 ]);return {users:users.rows,gifts:gifts.rows,verifications:verifications.rows,nonMemberCreatorTargets:targets.rows[0]?.count??0};}
 async users(){const r=await this.db.query("SELECT u.id,u.email,u.display_name AS \"displayName\",u.role,u.created_at AS \"createdAt\",COALESCE((SELECT status FROM verifications v WHERE v.user_id=u.id ORDER BY created_at DESC LIMIT 1),'NOT_STARTED') AS \"verificationStatus\" FROM users u ORDER BY u.created_at DESC LIMIT 200");return r.rows;}
 async gifts(){const r=await this.db.query("SELECT g.id,g.gift_code AS \"giftCode\",g.fan_id AS \"fanId\",g.creator_id AS \"creatorId\",g.category,g.status,g.food_declared AS food,g.fragile_declared AS fragile,g.station_inspection_status AS \"inspectionStatus\",g.created_at AS \"createdAt\" FROM gifts g ORDER BY g.created_at DESC LIMIT 200");return r.rows;}
 async invitations(){const r=await this.db.query("SELECT i.id,i.status,i.channel,i.created_at AS \"createdAt\",i.sent_at AS \"sentAt\",t.handle,t.display_name AS \"displayName\",COUNT(e.id)::int AS \"uniqueFans\" FROM creator_invitations i JOIN creator_targets t ON t.id=i.creator_target_id LEFT JOIN creator_interest_events e ON e.creator_target_id=t.id GROUP BY i.id,t.handle,t.display_name ORDER BY i.created_at DESC LIMIT 100");return r.rows;}
 async setUserStatus(id:string,status:"ACTIVE"|"SUSPENDED",actorId:string){const r=await this.db.query("UPDATE users SET status=$1,updated_at=now() WHERE id=$2 RETURNING id,status",[status,id]);if(!r.rowCount)return null;await this.audit.record({actorId,action:status==="SUSPENDED"?"ADMIN_USER_SUSPEND":"ADMIN_USER_ACTIVATE",entityType:"user",entityId:id,metadata:{status}});return r.rows[0];}
 async markInvitationSent(id:string){const r=await this.db.query("UPDATE creator_invitations SET status='SENT',sent_at=COALESCE(sent_at,now()) WHERE id=$1 RETURNING id,status,sent_at AS \"sentAt\"",[id]);return r.rows[0];}
}