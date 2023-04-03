import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { UserSignUpDto } from 'src/auth/dto/user-signUp.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/sign-up')
  signUp(
    @Body(ValidationPipe) userSignUpDto: UserSignUpDto,
  ): Promise<UserSignUpDto> {
    return this.authService.signUp(userSignUpDto);
  }
}
