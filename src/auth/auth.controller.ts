import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/sign-up.dto';
import { Tokens } from 'src/core/interfaces/tokens.interface';
import { Public } from 'src/core/decorators/public.decorator';
import { SignInDto } from './dto/sign-in.dto';
import { UserId } from 'src/core/decorators/user-id.decorator';
import { RefreshTokenGuard } from 'src/core/guards/refresh-token.guard';
import { User } from 'src/core/decorators/user.decorator';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConflictResponse,
  ApiForbiddenResponse,
  ApiHeader,
  ApiNotFoundResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AccessTokenGuard } from 'src/core/guards/access-token.guard';
import { GoogleOAuthGuard } from 'src/core/guards/google-oauth.guard';
// import { Role } from 'src/core/decorators/role.decorator';
// import { Roles } from 'src/core/enums/roles.enum';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Get('google')
  @UseGuards(GoogleOAuthGuard)
  async googleAuth() {}

  @Public()
  @Get('google/callback')
  @UseGuards(GoogleOAuthGuard)
  googleAuthRedirect(@User() user: any) {
    return this.authService.googleLogin(user);
  }

  @ApiBadRequestResponse({
    description:
      'email must be an email. password must be longer than or equal to 8 characters. password must be a string',
  })
  @ApiConflictResponse({ description: 'User already exists' })
  @Post('sign-up')
  @Public()
  signUp(@Body() signUpDto: SignUpDto): Promise<Tokens> {
    return this.authService.signUp(signUpDto);
  }

  @ApiUnauthorizedResponse({ description: 'Invalid password' })
  @ApiNotFoundResponse({ description: 'User not found' })
  @Post('sign-in')
  @Public()
  @HttpCode(200)
  signIn(@Body() signInDto: SignInDto): Promise<Tokens> {
    return this.authService.signIn(signInDto);
  }

  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth()
  @Post('log-out')
  @HttpCode(200)
  logOut(@UserId() userId: string): void {
    return this.authService.logOut(userId);
  }

  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Invalid refresh token' })
  @UseGuards(RefreshTokenGuard)
  @Post('refresh')
  @ApiBearerAuth()
  @HttpCode(200)
  refresh(
    @UserId() userId: string,
    @User('refreshToken') refreshToken: string,
  ): Promise<Tokens> {
    return this.authService.refreshTokens(userId, refreshToken);
  }
}
