import { IsNotEmpty, IsNumberString, IsString } from 'class-validator';

export class createProductDTO {
  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @IsNotEmpty()
  @IsNumberString()
  readonly qty: number;

  @IsNumberString()
  @IsNotEmpty()
  readonly price: number;
}
