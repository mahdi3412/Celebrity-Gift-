import {Injectable,InternalServerErrorException} from "@nestjs/common";
import {createCipheriv,createDecipheriv,createHash,randomBytes} from "crypto";
import {mkdir,readFile,rm,writeFile} from "fs/promises";
import {join,resolve} from "path";
@Injectable()
export class PrivateStorageService{
 private readonly root=resolve(process.env.KYC_PRIVATE_STORAGE_PATH??".private/kyc");
 private key(){const raw=process.env.KYC_ENCRYPTION_KEY??"";try{const key=Buffer.from(raw,"hex");if(key.length!==32)throw new Error();return key;}catch{throw new InternalServerErrorException("KYC_ENCRYPTION_KEY must be 64 hex characters");}}
 async put(key:string,data:Buffer){const iv=randomBytes(12);const cipher=createCipheriv("aes-256-gcm",this.key(),iv);const ciphertext=Buffer.concat([cipher.update(data),cipher.final()]);const tag=cipher.getAuthTag();const file=join(this.root,key+".bin");await mkdir(join(this.root,key.split("/")[0]),{recursive:true,mode:0o700});await writeFile(file,Buffer.concat([iv,tag,ciphertext]),{mode:0o600});return {storageKey:key,sha256:createHash("sha256").update(data).digest("hex"),bytes:data.length};}
 async get(key:string){const file=join(this.root,key+".bin");const packed=await readFile(file);const iv=packed.subarray(0,12);const tag=packed.subarray(12,28);const ciphertext=packed.subarray(28);const decipher=createDecipheriv("aes-256-gcm",this.key(),iv);decipher.setAuthTag(tag);return Buffer.concat([decipher.update(ciphertext),decipher.final()]);}
 async remove(key:string){await rm(join(this.root,key+".bin"),{force:true});}
}