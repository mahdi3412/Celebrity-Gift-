import {Global,Injectable,Inject,Module,OnModuleDestroy} from "@nestjs/common";
import {ConfigService} from "@nestjs/config";
import {createClient} from "redis";
export const REDIS_CLIENT="REDIS_CLIENT";
@Injectable()
class RedisLifecycleService implements OnModuleDestroy{
 constructor(@Inject(REDIS_CLIENT) private readonly client:any){}
 async onModuleDestroy(){if(this.client?.isOpen)await this.client.quit();}
}
@Global()
@Module({providers:[{provide:REDIS_CLIENT,useFactory:async(config:ConfigService)=>{const client=createClient({url:config.getOrThrow<string>("REDIS_URL")});client.on("error",()=>undefined);await client.connect();return client;},inject:[ConfigService]},RedisLifecycleService],exports:[REDIS_CLIENT]})
export class RedisModule{}