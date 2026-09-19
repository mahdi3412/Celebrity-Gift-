import {ForbiddenException} from "@nestjs/common";
import {RolesGuard} from "./roles.guard";

describe("RolesGuard",()=>{const reflector={getAllAndOverride:jest.fn()};const guard=new RolesGuard(reflector as any);const context=(user:any)=>({getHandler:()=>({}),getClass:()=>({}),switchToHttp:()=>({getRequest:()=>({user})})});beforeEach(()=>reflector.getAllAndOverride.mockReset());
it("allows an unscoped endpoint",()=>{reflector.getAllAndOverride.mockReturnValue(undefined);expect(guard.canActivate(context({role:"fan"}) as any)).toBe(true);});
it("allows a permitted role",()=>{reflector.getAllAndOverride.mockReturnValue(["admin"]);expect(guard.canActivate(context({role:"admin"}) as any)).toBe(true);});
it("rejects a forbidden role",()=>{reflector.getAllAndOverride.mockReturnValue(["admin"]);expect(()=>guard.canActivate(context({role:"fan"}) as any)).toThrow(ForbiddenException);});});