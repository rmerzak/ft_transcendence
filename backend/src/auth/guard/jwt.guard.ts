import { AuthGuard } from "@nestjs/passport";
import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from "@nestjs/jwt";
import { verify } from "jsonwebtoken";
import { ExtractJwt } from "passport-jwt";
@Injectable()
export class JwtGuard extends AuthGuard('jwt') {}
