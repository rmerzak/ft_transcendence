import { BadRequestException, ForbiddenException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './Dto';
import * as argon from 'argon2'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from '@nestjs/config';
import { Prisma } from '@prisma/client';
@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService,  private jwt:JwtService, private config: ConfigService) {
        
    }
    async signup(dto: AuthDto): Promise<any> {
        try {
            let user = await this.prisma.user.findUnique({ where: { email: dto.email } });
            if (user)
                return user;
            user = await this.prisma.user.create({
                data:{
                    email: dto.email,
                    image: dto.image,
                    firstname: dto.firstname,
                    lastname: dto.lastname,
                    username: dto.username,
                }
            })
            return user;
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2002') {
                  throw new BadRequestException('User with this email already exists.');
                } else {
                  throw new InternalServerErrorException('Error during user signup');
                }
              }
              throw new InternalServerErrorException('Error during user signup');
        }

    }

    async signin(dto: AuthDto) {
        const user = this.prisma.user.findUnique({
            where:{
                email: dto.email,
            }
        })
        if(!user) {
            throw new ForbiddenException('Credentiel incorrect')
        }
        return this.signToken((await user).id, (await user).email);
    }

     async signToken(userId: number, email:string) {
        const payload = {
            sub: userId,
            email
        }
        const secret = this.config.get('JWT_SERCRET')
        const token =  await this.jwt.signAsync(payload, {
            expiresIn: '190m',
            secret: secret,
        })
        return {access_token: token,};
    }
}