import {Injectable} from "@nestjs/common";
export type VerificationStatus="NOT_STARTED"|"SUBMITTED"|"AUTO_VERIFIED"|"MANUAL_REVIEW"|"FAILED"|"RESUBMIT";
@Injectable() export class VerificationService {
  private status=new Map<string,VerificationStatus>();
  submit(userId:string){this.status.set(userId,"SUBMITTED");return {userId,status:"SUBMITTED",message:"درخواست احراز هویت دریافت شد."};}
  review(userId:string,approved:boolean){const next=approved?"AUTO_VERIFIED":"RESUBMIT";this.status.set(userId,next);return {userId,status:next};}
  get(userId:string){return {userId,status:this.status.get(userId)??"NOT_STARTED"};}
}