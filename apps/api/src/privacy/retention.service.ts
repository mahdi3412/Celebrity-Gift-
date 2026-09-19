import {Injectable,Logger} from "@nestjs/common";
import {Cron} from "@nestjs/schedule";
import {DatabaseService} from "../database/database.service";
import {PrivateStorageService} from "../storage/private-storage.service";
@Injectable()
export class RetentionService{
 private readonly logger=new Logger(RetentionService.name);
 constructor(private readonly db:DatabaseService,private readonly storage:PrivateStorageService){}
 @Cron("0 0 3 * * *",{name:"kyc-artifact-retention",timeZone:"Asia/Kolkata",waitForCompletion:true})
 async purgeExpiredKycArtifacts(){const rows=await this.db.query<{id:string,storageKey:string}>("SELECT id,storage_key AS \"storageKey\" FROM verification_artifacts WHERE delete_after_at IS NOT NULL AND delete_after_at<=now() ORDER BY delete_after_at ASC LIMIT 100");let deleted=0;for(const row of rows.rows){try{await this.storage.remove(row.storageKey);await this.db.query("DELETE FROM verification_artifacts WHERE id=$1",[row.id]);deleted++;}catch(error){this.logger.error("Failed to purge KYC artifact",error);}}if(deleted)this.logger.log("Purged "+deleted+" expired KYC artifacts");}
}