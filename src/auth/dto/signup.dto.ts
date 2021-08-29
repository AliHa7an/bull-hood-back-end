import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class SignupDto {
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  username: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  email: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  password: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  mobile: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  state: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  country: string;
}
