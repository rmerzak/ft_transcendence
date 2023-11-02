import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './Dto';
import * as argon from 'argon2'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from '@nestjs/config';
@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService,  private jwt:JwtService, private config: ConfigService) {
        
    }
    async signup(dto: AuthDto) {
        // generate the password hash
        const hash = await argon.hash(dto.password)
        // save hte user in hte db
        try {
            const user = await this.prisma.user.create({
                data:{
                    email: dto.email,
                    hash,
                }
            })
            return this.signToken((await user).id, (await user).email);
        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError) {
                if (error.code === 'P2002') {
                    throw new ForbiddenException('Credential taken')
                }
            }
            throw error;
            
        }
        // return the token of the new saved user

    }
    async signin(dto: AuthDto) {
        //find the user by email
        const user = this.prisma.user.findUnique({
            where:{
                email: dto.email,
            }
        })
        // if the user not exisit throw exception
        if(!user) {
            throw new ForbiddenException('Credentiel incorrect')
        }
        // compare password
        const match = await argon.verify((await user).hash, dto.password);

        if (!match)
            throw new ForbiddenException('Password do not Match')
        //send user token
        return this.signToken((await user).id, (await user).email);
    }

     signToken(userId: number, email:string) {
        const payload = {
            sub: userId,
            email
        }
        const secret = this.config.get('JWT_SERCRET')
        return this.jwt.signAsync(payload, {
            expiresIn: '150m',
            secret: secret,
        })
    }
}