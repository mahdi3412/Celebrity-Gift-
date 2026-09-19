import type {VerificationStatus} from "./verification.service";
export type KycFile={buffer:Buffer;fileName:string;mimeType:string};
export type KycSubmission={userId:string;documentType:"aadhaar"|"pan"|"passport"|"voter_id"|"driving_license";document:KycFile;selfie:KycFile};
export type KycResult={provider:string;reference:string;status:VerificationStatus;livenessPassed:boolean|null;faceMatchPassed:boolean;providerScore?:number};
export interface KycProvider{submit(input:KycSubmission):Promise<KycResult>;}
export const KYC_PROVIDER="KYC_PROVIDER";