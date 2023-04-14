import {
  Body,
  Controller,
  HttpCode,
  Post,
  Req,
  Res,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { HttpExceptionFilter } from 'src/ExceptionFilter/httpExceptionFilter';
import { AuthService } from 'src/auth/auth.service';
import { Public } from 'src/auth/decorators/public-decorator';
import { UserSignInInputDto } from 'src/auth/dto/user-signIn.input.dto';
import { UserSignInOutputDto } from 'src/auth/dto/user-signIn.output.dto';
import { UserSignUpInputDto } from 'src/auth/dto/user-signUp.input.dto';
import { User } from 'src/auth/entity/user.entity';
import { LocalAuthGuard } from 'src/auth/guards/local-auth.guard';
import { RequestWithUser } from 'src/auth/type/requestWithUser.type';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('/sign-up')
  @UseFilters(new HttpExceptionFilter())
  signUp(
    @Body() userSignUpInputDto: UserSignUpInputDto,
  ): Promise<UserSignUpInputDto> {
    return this.authService.signUp(userSignUpInputDto);
  }

  @Public()
  @HttpCode(200)
  @UseGuards(LocalAuthGuard)
  @Post('/sign-in')
  async signIn(
    @Req() req: RequestWithUser,
    @Res({ passthrough: true }) res: Response,
  ): Promise<UserSignInOutputDto> {
    const user = req.user;

    const { accessToken, ...accessOption } =
      await this.authService.getCookieWithJwtAccessToken(user.id);

    const { refreshToken, ...refreshOption } =
      await this.authService.getCookieWithJwtRefreshToken(user.id);
    await this.authService.setCurrentRefreshToken(refreshToken, user.id);

    res.cookie('Authentication', accessToken, accessOption);
    res.cookie('Refresh', refreshToken, refreshOption);

    return {
      accessToken,
      refreshToken,
      id: user.id,
    };
  }
}
