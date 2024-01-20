import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class TwoFa {
    @IsOptional()
    @IsString()
    secret: string;
}