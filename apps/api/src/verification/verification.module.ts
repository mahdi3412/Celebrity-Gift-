import {Module} from "@nestjs/common";
import {VerificationController} from "./verification.controller";
import {VerificationService} from "./verification.service";
import {ManualKycProvider} from "./manual-kyc.provider";
import {KYC_PROVIDER} from "./kyc.provider";
@Module({controllers:[VerificationController],providers:[VerificationService,ManualKycProvider,{provide:KYC_PROVIDER,useExisting:ManualKycProvider}],exports:[VerificationService]})
export class VerificationModule{}