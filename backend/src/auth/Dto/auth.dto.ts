import { IsEmail, IsInt, IsNotEmpty, IsOptional, IsString } from "class-validator"

export class AuthDto {
    @IsEmail()
    email: string;
  
    @IsOptional()
    @IsString()
    firstname?: string;
  
    @IsOptional()
    @IsString()
    lastname?: string;
  
    @IsOptional()
    @IsString()
    username?: string;
  
    @IsOptional()
    @IsString()
    image?: string;
  
    @IsInt()
    gamewins?: number = 0;
  
    @IsInt()
    gameplays?: number = 0;
  
    @IsInt()
    gamefails?: number = 0;
  
    @IsInt()
    gamepoints?: number = 0;
}