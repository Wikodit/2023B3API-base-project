import { IsNotEmpty } from 'class-validator';
export class LoginResponseDto {
  @IsNotEmpty()
  id: string;
  @IsNotEmpty()
  email: string;
  @IsNotEmpty()
  access_token: string;
}
