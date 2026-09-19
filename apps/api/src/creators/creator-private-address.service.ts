import {Injectable,NotFoundException} from "@nestjs/common";
import {DatabaseService} from "../database/database.service";
import {PrivateFieldEncryptionService} from "../privacy/private-field-encryption.service";
@Injectable()
export class CreatorPrivateAddressService{
 constructor(private readonly db:DatabaseService,private readonly crypto:PrivateFieldEncryptionService){}
 async set(creatorId:string,address:string,pincode?:string){const encrypted=this.crypto.encrypt(address.trim());const encryptedPincode=pincode?.trim()?this.crypto.encrypt(pincode.trim()):null;await this.db.query("INSERT INTO creator_private_addresses(creator_id,encrypted_address,encrypted_pincode) VALUES($1,$2,$3) ON CONFLICT(creator_id) DO UPDATE SET encrypted_address=EXCLUDED.encrypted_address,encrypted_pincode=EXCLUDED.encrypted_pincode,updated_at=now()",[creatorId,encrypted,encryptedPincode]);return {saved:true};}
 async get(creatorId:string){const r=await this.db.query<{encrypted_address:string,encrypted_pincode:string|null}>("SELECT encrypted_address,encrypted_pincode FROM creator_private_addresses WHERE creator_id=$1",[creatorId]);const row=r.rows[0];return {address:row?this.crypto.decrypt(row.encrypted_address):null,pincode:row?.encrypted_pincode?this.crypto.decrypt(row.encrypted_pincode):null};}
 async getForFulfillment(creatorId:string){const value=await this.get(creatorId);if(!value.address)throw new NotFoundException("Creator destination is not configured");return value;}
}
