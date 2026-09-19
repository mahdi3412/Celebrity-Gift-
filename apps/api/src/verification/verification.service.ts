import {Inject,Injectable,NotFoundException} from "@nestjs/common";
import {DatabaseService} from "../database/database.service";
import {KYC_PROVIDER,KycFile,KycProvider} from "./kyc.provider";
import {NotificationsService} from "../notifications/notifications.service";
import {PrivateStorageService} from "../storage/private-storage.service";
export type VerificationStatus="NOT_STARTED"|"SUBMITTED"|"AUTO_VERIFIED"|"MANUAL_REVIEW"|"FAILED"|"RESUBMIT";
@Injectable()
export class VerificationService{
 constructor(private readonly db:DatabaseService,@Inject(KYC_PROVIDER) private readonly provider:KycProvider,private readonly notifications:NotificationsService,private readonly storage:PrivateStorageService){}
 async submit(userId:string,documentType:"aadhaar"|"pan"|"passport"|"voter_id"|"driving_license",document:KycFile,selfie:KycFile){
  const verificationId=(await this.db.query<{id:string}>("INSERT INTO verifications(user_id,status,provider,document_type,submitted_at) VALUES($1,'SUBMITTED',$2,$3,now()) RETURNING id",[userId,"pending",documentType])).rows[0].id;
  const docStore=await this.storage.put(userId+"/"+verificationId+"/document",document.buffer);const selfieStore=await this.storage.put(userId+"/"+verificationId+"/selfie",selfie.buffer);
  await this.db.query("INSERT INTO verification_artifacts(verification_id,kind,document_type,storage_key,sha256,bytes,mime_type) VALUES($1,'IDENTITY_DOCUMENT',$2,$3,$4,$5,$6),($1,'SELFIE',NULL,$7,$8,$9,$10)",[verificationId,documentType,docStore.storageKey,docStore.sha256,docStore.bytes,document.mimeType,selfieStore.storageKey,selfieStore.sha256,selfieStore.bytes,selfie.mimeType]);
  try{
   const result=await this.provider.submit({userId,documentType,document,selfie});
   await this.db.query("UPDATE verifications SET status=$1,provider=$2,provider_reference=$3,liveness_passed=$4,face_match_passed=$5,provider_score=$6 WHERE id=$7",[result.status,result.provider,result.reference,result.livenessPassed,result.faceMatchPassed,result.providerScore??null,verificationId]);
   await this.notifications.create({userId,type:"VERIFICATION_SUBMITTED",title:"احراز هویت ارسال شد",body:result.status==="AUTO_VERIFIED"?"احراز هویت شما به‌صورت خودکار تایید شد.":"احراز هویت شما برای بررسی دستی ثبت شد.",entityType:"verification",entityId:verificationId});
   return {verificationId,status:result.status,provider:result.provider,reference:result.reference,livenessPassed:result.livenessPassed,faceMatchPassed:result.faceMatchPassed};
  }catch(error){await this.db.query("UPDATE verifications SET status='MANUAL_REVIEW' WHERE id=$1",[verificationId]);await this.notifications.create({userId,type:"VERIFICATION_MANUAL_REVIEW",title:"نیاز به بررسی دستی",body:"احراز هویت به بررسی دستی منتقل شد.",entityType:"verification",entityId:verificationId});return {verificationId,status:"MANUAL_REVIEW" as VerificationStatus};}
 }
 async review(userId:string,approved:boolean){const status:VerificationStatus=approved?"AUTO_VERIFIED":"RESUBMIT";const result=await this.db.query("UPDATE verifications SET status=$1,reviewed_at=now() WHERE id=(SELECT id FROM verifications WHERE user_id=$2 ORDER BY created_at DESC LIMIT 1) RETURNING id",[status,userId]);if(!result.rowCount)throw new NotFoundException("Verification not found");await this.notifications.create({userId,type:approved?"VERIFICATION_APPROVED":"VERIFICATION_RESUBMIT",title:approved?"احراز هویت تایید شد":"نیاز به ارسال مجدد",body:approved?"احراز هویت شما تایید شد.":"لطفاً اطلاعات احراز هویت را بررسی و دوباره ارسال کنید.",entityType:"verification",entityId:userId});return {userId,status};}
 async get(userId:string){const result=await this.db.query<{status:VerificationStatus,provider:string|null,document_type:string|null,submitted_at:string|null,reviewed_at:string|null}>("SELECT status,provider,document_type,submitted_at,reviewed_at FROM verifications WHERE user_id=$1 ORDER BY created_at DESC LIMIT 1",[userId]);const row=result.rows[0];return {userId,status:row?.status??"NOT_STARTED",provider:row?.provider??null,documentType:row?.document_type??null,submittedAt:row?.submitted_at??null,reviewedAt:row?.reviewed_at??null};}
 async listManualReview(){const r=await this.db.query("SELECT v.id,v.user_id AS \"userId\",u.email,v.document_type AS \"documentType\",v.status,v.submitted_at AS \"submittedAt\" FROM verifications v JOIN users u ON u.id=v.user_id WHERE v.status='MANUAL_REVIEW' ORDER BY v.created_at ASC LIMIT 100");return r.rows;}
}