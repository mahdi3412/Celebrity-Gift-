import {ConflictException,Injectable,UnauthorizedException} from "@nestjs/common";
import {JwtService} from "@nestjs/jwt";
import * as argon2 from "argon2";
import {randomUUID} from "crypto";
import {DatabaseService} from "../database/database.service";
import {Role} from "./auth.constants";
@Injectable() export class AuthService{
 constructor(private readonly db:DatabaseService,private readonly jwt:JwtService){}
 async register(email:string,password:string,role:Role){const normalized=email.trim().toLowerCase();const existing=await this.db.query("SELECT id FROM users WHERE email=$1",[normalized]);if(existing.rowCount)throw new ConflictException("Email already registered");const passwordHash=await argon2.hash(password,{type:argon2.argon2id,memoryCost:19456,timeCost:2,parallelism:1});const id=randomUUID();await this.db.query("INSERT INTO users(id,email,password_hash,role) VALUES($1,$2,$3,$4)",[id,normalized,passwordHash,role]);return this.issueTokens(id,role);}
 async login(email:string,password:string){const result=await this.db.query<{id:string,password_hash:string,role:Role}>("SELECT id,password_hash,role FROM users WHERE email=$1",[email.trim().toLowerCase()]);const user=result.rows[0];if(!user||!(await argon2.verify(user.password_hash,password)))throw new UnauthorizedException("Invalid credentials");return this.issueTokens(user.id,user.role);}
 private async issueTokens(userId:string,role:Role){const accessToken=await this.jwt.signAsync({sub:userId,role},{expiresIn:process.env.JWT_ACCESS_TTL??"15m"});const refreshToken=await this.jwt.signAsync({sub:userId,role,type:"refresh"},{secret:process.env.JWT_REFRESH_SECRET,expiresIn:process.env.JWT_REFRESH_TTL??"30d"});return {accessToken,refreshToken,tokenType:"Bearer",expiresIn:process.env.JWT_ACCESS_TTL??"15m"};}
}