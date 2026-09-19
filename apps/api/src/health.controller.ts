import {Controller,Get,ServiceUnavailableException} from "@nestjs/common";
import {Inject} from "@nestjs/common";
import {DatabaseService} from "./database/database.service";
import {REDIS_CLIENT} from "./redis/redis.module";
import {Public} from "./auth/public.decorator";
@Controller("health")
export class HealthController{
 constructor(private readonly db:DatabaseService,@Inject(REDIS_CLIENT) private readonly redis:any){}
 @Public()@Get() check(){return {status:"ok",service:"celebrity-gift-api",timestamp:new Date().toISOString()};}
 @Public()@Get("ready") async ready(){try{await this.db.query("SELECT 1");await this.redis.ping();return {status:"ready",database:"ok",redis:"ok",timestamp:new Date().toISOString()};}catch{throw new ServiceUnavailableException({status:"not_ready",database:"unknown",redis:"unknown"});}}
}