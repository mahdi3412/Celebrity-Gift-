import {Module} from "@nestjs/common";
import {ConfigModule} from "@nestjs/config";
import * as Joi from "joi";
import {AuthModule} from "./auth/auth.module";
import {HealthController} from "./health.controller";
@Module({imports:[ConfigModule.forRoot({isGlobal:true,validationSchema:Joi.object({NODE_ENV:Joi.string().default("development"),API_PORT:Joi.number().default(4000),JWT_ACCESS_SECRET:Joi.string().min(32).required()})}),AuthModule],controllers:[HealthController]})
export class AppModule{}