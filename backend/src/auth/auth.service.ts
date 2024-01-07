import { BadRequestException, Body, ForbiddenException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './Dto';
import * as argon from 'argon2'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from '@nestjs/config';
import { Prisma } from '@prisma/client';
import { v2 as cloudinary, UploadApiResponse, UploadApiErrorResponse } from "cloudinary";
const streamifier = require('streamifier');
@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService, private jwt: JwtService, private config: ConfigService) {
        cloudinary.config({
            cloud_name: "dkpmixnox",
            api_key: "631615643412693",
            api_secret: "9tHL9AT09Rf5pyPEtwNz1fQBFAE",
        });
    }
    async signup(dto: AuthDto): Promise<any> {
        try {
            let user = await this.prisma.user.findUnique({ where: { email: dto.email } });
            if (user)
            return user;
        user = await this.prisma.user.create({
            data: {
                id: dto.id,
                email: dto.email,
                image: dto.image,
                firstname: dto.firstname,
                lastname: dto.lastname,
                username: dto.username,
                twoFactorSecret: "null",
            },
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
            where: {
                email: dto.email,
            }
        })
        if (!user) {
            throw new ForbiddenException('Credentiel incorrect')
        }
        return this.signToken((await user).id, (await user).email);
    }

    async signToken(userId: number, email: string) {
        const payload = {
            sub: userId,
            email
        }
        const secret = this.config.get('JWT_SERCRET')
        const token = await this.jwt.signAsync(payload, {
            expiresIn: '190m',
            secret: secret,
        })
        return { accessToken: token };
    }

    async finishAuth(data: any, email: string) {
        try {
            const user = await this.prisma.user.findUnique({ where: { email: email } });
            if (!user)
                throw new BadRequestException('User not found');
            return await this.prisma.user.update({
                where: {
                    id: user.id
                },
                data: {
                    isVerified: true,
                    username: data.username.length > 0 ? data.username : user.username,
                    image: data.image.length > 0 ? data.image : user.image,
                }
            });
        } catch (error) {
            throw new InternalServerErrorException('Error during user Update');
        }
    }

    async uploadImage(file: Express.Multer.File): Promise<UploadApiResponse | UploadApiErrorResponse> {
        return new Promise<any>((resolve, reject) => {
            const folderName = 'users';
            const uploadOptions = {
                folder: folderName,
            };
            const uploadStream = cloudinary.uploader.upload_stream(
                uploadOptions,
                (error, result) => {
                    if (error) return reject(error);
                    else resolve(result);
                }
            );
            streamifier.createReadStream(file.buffer).pipe(uploadStream);
        });
    }
    async validateAccessToken(accessToken: string): Promise<boolean> {
        try {
          const decoded = await this.jwt.verify(accessToken, this.config.get('JWT_SERCRET'));
          return !!decoded;
        } catch (error) {
          console.error('Error validating token:', error);
          return false;
        }
      }
    async findUserById(id: number) {
        const user = await this.prisma.user.findUnique({ where: { id } });
        if (!user) {
            throw new ForbiddenException('Credentiel incorrect')
        }
        return user;
    }
}