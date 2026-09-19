import {Global,Module} from "@nestjs/common";
import {ConfigService} from "@nestjs/config";
import {Pool} from "pg";
import {DatabaseService} from "./database.service";
export const PG_POOL="PG_POOL";
@Global()
@Module({providers:[{provide:PG_POOL,useFactory:(config:ConfigService)=>new Pool({connectionString:config.getOrThrow<string>("DATABASE_URL"),max:10}),inject:[ConfigService]},DatabaseService],exports:[PG_POOL,DatabaseService]})
export class DatabaseModule{}