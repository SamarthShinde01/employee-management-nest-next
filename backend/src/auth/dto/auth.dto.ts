import { IsEmail, IsNotEmpty, IsOptional, IsIn } from 'class-validator';

export class RegisterDto {
    @IsNotEmpty()
    name: string;

    @IsEmail()
    email: string;

    @IsNotEmpty()
    password: string;

    @IsOptional()
    @IsIn(['USER', 'ADMIN'])
    role?: 'USER' | 'ADMIN';
}

export class LoginDto {
    @IsEmail()
    email: string;

    @IsNotEmpty()
    password: string;
}
