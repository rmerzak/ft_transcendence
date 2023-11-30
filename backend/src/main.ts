import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe())
  app.use(cookieParser());

// app.enableCors({
//     origin: "http://localhost:8080",
//     methods: ["GET","HEAD","PUT","PATCH","POST","DELETE"],
//     allowedHeaders: 'Content-Type, Accept, Authorization, X-Requested-With, Access-Control-Allow-Origin, Access-Control-Allow-Headers, Access-Control-Allow-Credentials, Access-Control-Allow-Methods',
//     credentials: true,
//   });
  await app.listen(3000);
}
bootstrap();
