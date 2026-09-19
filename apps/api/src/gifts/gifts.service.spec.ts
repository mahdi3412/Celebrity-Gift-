import {BadRequestException,ForbiddenException} from "@nestjs/common";
import {GiftsService} from "./gifts.service";

describe("GiftsService",()=>{const db={query:jest.fn()};const notifications={create:jest.fn()};const thresholds={get:jest.fn()};const service=new GiftsService(db as any,notifications as any,thresholds as any);
beforeEach(()=>{db.query.mockReset();notifications.create.mockReset();thresholds.get.mockReset();});
it("rejects a gift for an unverified fan",async()=>{db.query.mockResolvedValueOnce({rowCount:1}).mockResolvedValueOnce({rowCount:1}).mockResolvedValueOnce({rowCount:0});await expect(service.create({fanId:"fan",creatorId:"creator",category:"book"})).rejects.toThrow(ForbiddenException);});
it("rejects food without an expiry date",async()=>{await expect(service.create({fanId:"fan",creatorId:"creator",category:"food",food:true})).rejects.toThrow(BadRequestException);});
it("blocks a creator from accepting before delivery",async()=>{db.query.mockResolvedValueOnce({rows:[{id:"g1",giftCode:"GFT-000184",fanId:"fan",creatorId:"creator",category:"book",status:"REQUESTED",food:false,fragile:false,noteDeclared:false,createdAt:new Date().toISOString()}],rowCount:1});await expect(service.transitionForUser("g1","ACCEPTED","creator","creator")).rejects.toThrow(ForbiddenException);});});