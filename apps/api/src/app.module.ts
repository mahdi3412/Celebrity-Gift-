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
import {NotificationsModule} from "./notifications/notifications.module";
import {StorageModule} from "./storage/storage.module";
import {CourierModule} from "./courier/courier.module";
import {AdminModule} from "./admin/admin.module";
import {ScheduleModule} from "@nestjs/schedule";
import {PrivacyModule} from "./privacy/privacy.module";
import {SettingsModule} from "./settings/settings.module";
@Module({
 imports:[ScheduleModule.forRoot(),ConfigModule.forRoot({isGlobal:true,validationSchema:Joi.object({NODE_ENV:Joi.string().default("development"),API_PORT:Joi.number().default(4000),DATABASE_URL:Joi.string().uri().required(),JWT_ACCESS_SECRET:Joi.string().min(32).required(),JWT_REFRESH_SECRET:Joi.string().min(32).required(),JWT_ACCESS_TTL:Joi.string().default("15m"),JWT_REFRESH_TTL:Joi.string().default("30d"),KYC_PROVIDER:Joi.string().valid("manual","hyperverge").default("manual"),KYC_ENCRYPTION_KEY:Joi.string().hex().length(64).when("NODE_ENV",{is:"production",then:Joi.required()}),KYC_PRIVATE_STORAGE_PATH:Joi.string().default(".private/kyc"),HYPERVERGE_APP_ID:Joi.string().when("KYC_PROVIDER",{is:"hyperverge",then:Joi.required()}),HYPERVERGE_APP_KEY:Joi.string().when("KYC_PROVIDER",{is:"hyperverge",then:Joi.required()}),HYPERVERGE_LIVENESS_URL:Joi.string().uri().when("KYC_PROVIDER",{is:"hyperverge",then:Joi.required()}),KYC_WEBHOOK_SECRET:Joi.string().min(32).when("NODE_ENV",{is:"production",then:Joi.required()}),SWAGGER_ENABLED:Joi.boolean().default(true)})}),ThrottlerModule.forRoot([{name:"default",ttl:60000,limit:120}]),DatabaseModule,AuditModule,NotificationsModule,StorageModule,CourierModule,AdminModule,PrivacyModule,SettingsModule,AuthModule,CreatorsModule,GiftsModule,VerificationModule,StationModule,ThresholdsModule],
 controllers:[HealthController],
 providers:[{provide:APP_GUARD,useClass:ThrottlerGuard},{provide:APP_GUARD,useClass:AuthGuard},{provide:APP_GUARD,useClass:RolesGuard}]
}) export class AppModule{}