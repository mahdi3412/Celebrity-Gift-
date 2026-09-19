import {Global,Module} from "@nestjs/common";
import {ConfigService} from "@nestjs/config";
import {Pool} from "pg";
import {DatabaseBootstrapService} from "./database-bootstrap.service";
import {PG_POOL} from "./database.constants";
import {DatabaseService} from "./database.service";
@Global()
@Module({providers:[DatabaseBootstrapService,{provide:PG_POOL,useFactory:(config:ConfigService)=>new Pool({connectionString:config.getOrThrow<string>("DATABASE_URL"),max:10}),inject:[ConfigService]},DatabaseService],exports:[PG_POOL,DatabaseService]})
export class DatabaseModule{}