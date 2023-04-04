import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { UserSignInDto } from 'src/auth/dto/user-signIn.dto';
import { UserSignUpDto } from 'src/auth/dto/user-signUp.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/sign-up')
  signUp(@Body() userSignUpDto: UserSignUpDto): Promise<UserSignUpDto> {
    return this.authService.signUp(userSignUpDto);
  }

  @Post('/sign-in')
  signIn(
    @Body() userSignInDto: UserSignInDto,
  ): Promise<{ accessToken: string }> {
    return this.authService.signIn(userSignInDto);
  }
}
