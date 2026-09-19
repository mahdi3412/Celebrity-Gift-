import {BadRequestException,Injectable} from "@nestjs/common";
import {DatabaseService} from "../database/database.service";
export type ThresholdConfig={publicInterest:number;strongInvite:number;maxUniqueRequestsPerFan:number};
@Injectable()
export class ThresholdsService{
 constructor(private readonly db:DatabaseService){}
 async get():Promise<ThresholdConfig>{const r=await this.db.query<ThresholdConfig>("SELECT public_interest AS \"publicInterest\",strong_invite AS \"strongInvite\",max_unique_requests_per_fan AS \"maxUniqueRequestsPerFan\" FROM platform_thresholds WHERE id=1");return r.rows[0];}
 async update(input:Partial<ThresholdConfig>){const current=await this.get();const next={...current,...input};if(!Number.isInteger(next.publicInterest)||!Number.isInteger(next.strongInvite)||!Number.isInteger(next.maxUniqueRequestsPerFan)||next.publicInterest<=0||next.strongInvite<next.publicInterest||next.maxUniqueRequestsPerFan<=0)throw new BadRequestException("Invalid threshold configuration");const r=await this.db.query<ThresholdConfig>("UPDATE platform_thresholds SET public_interest=$1,strong_invite=$2,max_unique_requests_per_fan=$3,updated_at=now() WHERE id=1 RETURNING public_interest AS \"publicInterest\",strong_invite AS \"strongInvite\",max_unique_requests_per_fan AS \"maxUniqueRequestsPerFan\"",[next.publicInterest,next.strongInvite,next.maxUniqueRequestsPerFan]);return r.rows[0];}
 async evaluate(uniqueFans:number,totalRequests:number){const config=await this.get();return {uniqueFans,totalRequests,publicInterest:uniqueFans>=config.publicInterest,strongInvite:uniqueFans>=config.strongInvite};}
}