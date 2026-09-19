import {Module} from "@nestjs/common";
import {APP_GUARD} from "@nestjs/core";
import {ConfigModule} from "@nestjs/config";
import {ThrottlerGuard,ThrottlerModule} from "@nestjs/throttler";
import * as Joi from "joi";
import {AuthModule} from "./auth/auth.module";
import {CreatorsModule} from "./creators/creators.module";
import {GiftsModule} from "./gifts/gifts.module";
import {VerificationModule} from "./verification/verification.module";
import {StationModule} from "./station/station.module";
import {ThresholdsModule} from "./thresholds/thresholds.module";
import {DatabaseModule} from "./database/database.module";
import {AuthGuard} from "./auth/auth.guard";
import {RolesGuard} from "./auth/roles.guard";
import {HealthController} from "./health.controller";
import {AuditModule} from "./audit/audit.module";
@Module({
 imports:[ConfigModule.forRoot({isGlobal:true,validationSchema:Joi.object({NODE_ENV:Joi.string().default("development"),API_PORT:Joi.number().default(4000),DATABASE_URL:Joi.string().uri().required(),JWT_ACCESS_SECRET:Joi.string().min(32).required(),JWT_REFRESH_SECRET:Joi.string().min(32).required(),JWT_ACCESS_TTL:Joi.string().default("15m"),JWT_REFRESH_TTL:Joi.string().default("30d")})}),ThrottlerModule.forRoot([{name:"default",ttl:60000,limit:120}]),DatabaseModule,AuditModule,AuthModule,CreatorsModule,GiftsModule,VerificationModule,StationModule,ThresholdsModule],
 controllers:[HealthController],
 providers:[{provide:APP_GUARD,useClass:ThrottlerGuard},{provide:APP_GUARD,useClass:AuthGuard},{provide:APP_GUARD,useClass:RolesGuard}]
}) export class AppModule{}