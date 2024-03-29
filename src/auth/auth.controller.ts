import {
  Body,
  Controller,
  HttpCode,
  Post,
  Res,
  Req,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { HttpExceptionFilter } from 'src/ExceptionFilter/httpExceptionFilter';
import { AuthService } from 'src/auth/auth.service';
import { Public } from 'src/auth/decorators/public-decorator';
import { UserSignInOutputDto } from 'src/auth/dto/user-signIn.output.dto';
import { UserSignUpInputDto } from 'src/auth/dto/user-signUp.input.dto';
import { JwtRefreshGuard } from 'src/auth/guards/jwt-refresh.guard';
import { LocalAuthGuard } from 'src/auth/guards/local-auth.guard';
import { RequestWithUser } from 'src/auth/type/requestWithUser.type';
import { CommuteRecordsService } from 'src/commute_records/commute_records.service';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private commuteRecordsService: CommuteRecordsService,
  ) {}

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
    await this.commuteRecordsService.createTodayRecordRow(user);
    const { accessToken } = await this.authService.getCookieWithJwtAccessToken(
      user.id,
    );
    const { refreshToken, ...refreshOption } =
      await this.authService.getCookieWithJwtRefreshToken(user.id);

    await this.authService.setCurrentRefreshToken(refreshToken, user.id);
    res.cookie('Refresh', refreshToken, refreshOption);
    return {
      accessToken,
      isMaster: user.isMaster,
    };
  }

  @Public()
  @Post('/sign-out')
  @UseGuards(JwtRefreshGuard)
  async signOut(@Req() req, @Res({ passthrough: true }) res: Response) {
    const { refreshOption } = this.authService.getCookiesForLogOut();
    await this.authService.removeRefreshToken(req.user.id);
    res.cookie('Refresh', '', refreshOption);
  }

  @Public()
  @UseGuards(JwtRefreshGuard)
  @Post('/refresh')
  async refresh(
    @Req() req: RequestWithUser,
    @Res({ passthrough: true }) res: Response,
  ) {
    const user = req.user;
    const { accessToken } = await this.authService.getCookieWithJwtAccessToken(
      user.id,
    );
    const { refreshToken, ...refreshOption } =
      await this.authService.getCookieWithJwtRefreshToken(user.id);

    await this.authService.setCurrentRefreshToken(refreshToken, user.id);
    res.cookie('Refresh', refreshToken, refreshOption);
    return {
      accessToken,
      isMaster: user.isMaster,
    };
  }
}
