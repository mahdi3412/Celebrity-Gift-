import {Injectable} from "@nestjs/common";
export type Creator={id:string;displayName:string;handle:string;category:string;uniqueFans:number;totalRequests:number};
@Injectable() export class CreatorsService {
  private readonly creators:Creator[]=[{id:"crt_demo",displayName:"نمونه کرییتور",handle:"@creator",category:"محتوا",uniqueFans:128,totalRequests:176}];
  findAll(){return this.creators.map(c=>({id:c.id,displayName:c.displayName,handle:c.handle,category:c.category,interestIndicator:c.uniqueFans>=150?"دعوت به عضویت پیشنهاد می‌شود":c.uniqueFans>=100?"علاقه عمومی قابل توجه":undefined}));}
  findOne(id:string){return this.creators.find(c=>c.id===id);}
}