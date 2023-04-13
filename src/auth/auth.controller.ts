import { Body, Controller, Post, UseFilters } from '@nestjs/common';
import { HttpExceptionFilter } from 'src/ExceptionFilter/httpExceptionFilter';
import { AuthService } from 'src/auth/auth.service';
import { UserSignInInputDto } from 'src/auth/dto/user-signIn.input.dto';
import { UserSignInOutputDto } from 'src/auth/dto/user-signIn.output.dto';
import { UserSignUpInputDto } from 'src/auth/dto/user-signUp.input.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/sign-up')
  @UseFilters(new HttpExceptionFilter())
  signUp(
    @Body() userSignUpInputDto: UserSignUpInputDto,
  ): Promise<UserSignUpInputDto> {
    return this.authService.signUp(userSignUpInputDto);
  }

  @Post('/sign-in')
  signIn(
    @Body() userSignInInputDto: UserSignInInputDto,
  ): Promise<UserSignInOutputDto> {
    return this.authService.signIn(userSignInInputDto);
  }
}
