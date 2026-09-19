import {Controller,Post,Req,Headers} from "@nestjs/common";
import {Throttle} from "@nestjs/throttler";
import {Request} from "express";
import {VerificationWebhookService} from "./verification-webhook.service";
import {Public} from "../auth/public.decorator";

type RawRequest=Request & {rawBody?:Buffer};
@Controller("verification/webhooks")
export class VerificationWebhookController{
 constructor(private readonly service:VerificationWebhookService){}
 @Public()@Throttle({default:{limit:30,ttl:60000}})@Post(":provider")
 async webhook(@Req() req:RawRequest,@Headers("x-cg-signature") signature=""){
  return this.service.handle(req.params.provider,req.rawBody??Buffer.from(""),signature);
 }
}
