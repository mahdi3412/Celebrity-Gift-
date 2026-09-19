import {Injectable} from "@nestjs/common";
import {KycProvider,KycSubmission} from "./kyc.provider";
import {VerificationStatus} from "./verification.service";
@Injectable()
export class ManualKycProvider implements KycProvider{
 async submit(_input:KycSubmission){return {provider:"manual",reference:"pending-review",status:"MANUAL_REVIEW" as VerificationStatus};}
}