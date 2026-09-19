import {Module} from "@nestjs/common";
import {ConfigModule} from "@nestjs/config";
import * as Joi from "joi";
import {AuthModule} from "./auth/auth.module";
import {CreatorsModule} from "./creators/creators.module";
import {GiftsModule} from "./gifts/gifts.module";
import {VerificationModule} from "./verification/verification.module";
import {StationModule} from "./station/station.module";
import {ThresholdsModule} from "./thresholds/thresholds.module";
import {DatabaseModule} from "./database/database.module";
import {HealthController} from "./health.controller";
@Module({imports:[ConfigModule.forRoot({isGlobal:true,validationSchema:Joi.object({NODE_ENV:Joi.string().default("development"),API_PORT:Joi.number().default(4000),DATABASE_URL:Joi.string().uri().required(),JWT_ACCESS_SECRET:Joi.string().min(32).required(),JWT_REFRESH_SECRET:Joi.string().min(32).required(),JWT_ACCESS_TTL:Joi.string().default("15m"),JWT_REFRESH_TTL:Joi.string().default("30d")})}),DatabaseModule,AuthModule,CreatorsModule,GiftsModule,VerificationModule,StationModule,ThresholdsModule],controllers:[HealthController]}) export class AppModule{}