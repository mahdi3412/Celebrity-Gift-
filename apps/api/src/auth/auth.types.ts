import {Role} from "./auth.constants";
export type AuthUser={sub:string,role:Role,jti?:string,type?:string};
export type AuthedRequest={user:AuthUser};