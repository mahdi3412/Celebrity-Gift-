import {Inject,Injectable,Logger} from "@nestjs/common";
import {ConfigService} from "@nestjs/config";
import {readFile} from "fs/promises";
import {join} from "path";
import {Pool} from "pg";
import {PG_POOL} from "./database.constants";

@Injectable()
export class DatabaseBootstrapService{
 private readonly logger=new Logger(DatabaseBootstrapService.name);
 constructor(private readonly config:ConfigService,@Inject(PG_POOL) private readonly pool:Pool){}
 async onModuleInit(){
  if(this.config.get("DB_AUTO_MIGRATE","true")!=="true")return;
  const sql=await readFile(join(__dirname,"schema.sql"),"utf8");
  await this.pool.query(sql);
  this.logger.log("PostgreSQL schema bootstrap completed");
 }
}