import "reflect-metadata";
import {ValidationPipe} from "@nestjs/common";
import {NestFactory} from "@nestjs/core";
import {DocumentBuilder,SwaggerModule} from "@nestjs/swagger";
import helmet from "helmet";
import {AppModule} from "./app.module";
async function bootstrap(){
 const app=await NestFactory.create(AppModule,{rawBody:true});
 app.use(helmet());
 app.enableCors({origin:(process.env.WEB_ORIGIN??"http://localhost:3000").split(","),credentials:true});
 app.useGlobalPipes(new ValidationPipe({whitelist:true,transform:true,forbidNonWhitelisted:true}));
 app.setGlobalPrefix("api");
 if(process.env.SWAGGER_ENABLED!=="false"){
  const config=new DocumentBuilder().setTitle("Celebrity Gift API").setDescription("Privacy-first physical gift platform API").setVersion("1.0").addBearerAuth().build();
  const documentFactory=()=>SwaggerModule.createDocument(app,config);
  SwaggerModule.setup("docs",app,documentFactory,{useGlobalPrefix:true,swaggerOptions:{persistAuthorization:true}});
 }
 await app.listen(Number(process.env.API_PORT??4000));
}
bootstrap();
