import {Injectable} from "@nestjs/common";
@Injectable() export class ThresholdsService {
  private config={publicInterest:100,strongInvite:150,maxUniqueRequestsPerFan:3};
  get(){return this.config;}
  evaluate(uniqueFans:number,totalRequests:number){return {uniqueFans,totalRequests,publicInterest:uniqueFans>=this.config.publicInterest,strongInvite:uniqueFans>=this.config.strongInvite};}
}