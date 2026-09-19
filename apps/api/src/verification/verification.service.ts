import {Inject,Injectable,NotFoundException} from "@nestjs/common";
import {DatabaseService} from "../database/database.service";
import {KYC_PROVIDER,KycProvider} from "./kyc.provider";
export type VerificationStatus="NOT_STARTED"|"SUBMITTED"|"AUTO_VERIFIED"|"MANUAL_REVIEW"|"FAILED"|"RESUBMIT";
@Injectable()
export class VerificationService{
 constructor(private readonly db:DatabaseService,@Inject(KYC_PROVIDER) private readonly provider:KycProvider){}
 async submit(userId:string){const result=await this.provider.submit({userId});await this.db.query("INSERT INTO verifications(user_id,status,provider,provider_reference,submitted_at) VALUES($1,$2,$3,$4,now())",[userId,result.status,result.provider,result.reference]);return {userId,status:result.status,message:"درخواست احراز هویت دریافت شد."};}
 async review(userId:string,approved:boolean){const status:VerificationStatus=approved?"AUTO_VERIFIED":"RESUBMIT";const result=await this.db.query("UPDATE verifications SET status=$1,reviewed_at=now() WHERE id=(SELECT id FROM verifications WHERE user_id=$2 ORDER BY created_at DESC LIMIT 1) RETURNING id",[status,userId]);if(!result.rowCount)throw new NotFoundException("Verification not found");return {userId,status};}
 async get(userId:string){const result=await this.db.query<{status:VerificationStatus,provider:string|null,submitted_at:string|null,reviewed_at:string|null}>("SELECT status,provider,submitted_at,reviewed_at FROM verifications WHERE user_id=$1 ORDER BY created_at DESC LIMIT 1",[userId]);const row=result.rows[0];return {userId,status:row?.status??"NOT_STARTED",provider:row?.provider??null,submittedAt:row?.submitted_at??null,reviewedAt:row?.reviewed_at??null};}
}