import type {VerificationStatus} from "./verification.service";
export type KycSubmission={userId:string};
export interface KycProvider{submit(input:KycSubmission):Promise<{provider:string,reference:string,status:VerificationStatus}>;}
export const KYC_PROVIDER="KYC_PROVIDER";