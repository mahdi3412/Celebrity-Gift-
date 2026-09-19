import {Injectable,UnauthorizedException} from "@nestjs/common";
import {JwtService} from "@nestjs/jwt";
@Injectable() export class AuthService {
  constructor(private readonly jwt:JwtService){}
  async issueDemoToken(userId:string,role:"fan"|"creator"|"admin"){
    if(!userId) throw new UnauthorizedException();
    return {accessToken:await this.jwt.signAsync({sub:userId,role}),tokenType:"Bearer",expiresIn:process.env.JWT_ACCESS_TTL??"15m"};
  }
}