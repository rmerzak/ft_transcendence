import { BadRequestException, ForbiddenException, Injectable, InternalServerErrorException } from '@nestjs/common';
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
            console.log(data)
            return await this.prisma.user.update({
                where: {
                    id: user.id
                },
                data: {
                    isVerified: data.twoFa === 'true' ? true : false,
                    username: data.username.lenght > 0 ? data.username : user.username,
                    image: data.image,
                }
            });
        } catch (error) {
            console.log(error);
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
}