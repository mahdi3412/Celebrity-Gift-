import {UnauthorizedException} from "@nestjs/common";
import {JwtService} from "@nestjs/jwt";
import {AuthGuard} from "./auth.guard";

describe("AuthGuard",()=>{const reflector={getAllAndOverride:jest.fn()};const jwt=new JwtService({secret:"12345678901234567890123456789012"});const guard=new AuthGuard(reflector as any,jwt);const context=(authorization?:string)=>({getHandler:()=>({}),getClass:()=>({}),switchToHttp:()=>({getRequest:()=>({headers:{authorization},user:undefined})})});beforeEach(()=>reflector.getAllAndOverride.mockReset());
it("allows a public endpoint",async()=>{reflector.getAllAndOverride.mockReturnValue(true);expect(await guard.canActivate(context() as any)).toBe(true);});
it("rejects missing credentials",async()=>{reflector.getAllAndOverride.mockReturnValue(false);await expect(guard.canActivate(context() as any)).rejects.toThrow(UnauthorizedException);});
it("accepts a valid bearer token",async()=>{reflector.getAllAndOverride.mockReturnValue(false);process.env.JWT_ACCESS_SECRET="12345678901234567890123456789012";const token=await jwt.signAsync({sub:"u1",role:"fan"});const ctx:any=context("Bearer "+token);expect(await guard.canActivate(ctx)).toBe(true);expect(ctx.switchToHttp().getRequest().user.sub).toBe("u1");});});