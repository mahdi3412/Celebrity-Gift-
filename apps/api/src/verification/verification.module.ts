import {Module} from "@nestjs/common";
import {VerificationController} from "./verification.controller";
import {VerificationService} from "./verification.service";
import {ManualKycProvider} from "./manual-kyc.provider";
import {KYC_PROVIDER} from "./kyc.provider";
import {HyperVergeKycProvider} from "./hyperverge.provider";
import {StorageModule} from "../storage/storage.module";
import {VerificationWebhookController} from "./verification-webhook.controller";
import {VerificationWebhookService} from "./verification-webhook.service";
@Module({imports:[StorageModule],controllers:[VerificationController,VerificationWebhookController],providers:[VerificationService,VerificationWebhookService,ManualKycProvider,HyperVergeKycProvider,{provide:KYC_PROVIDER,useFactory:()=>process.env.KYC_PROVIDER==="hyperverge"?new HyperVergeKycProvider():new ManualKycProvider()}],exports:[VerificationService]})
export class VerificationModule{}