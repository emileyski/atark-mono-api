import { Controller, Get, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { AccessTokenGuard } from 'src/core/guards/access-token.guard';
import { User } from 'src/core/decorators/user.decorator';
import {
  ApiBearerAuth,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiBearerAuth()
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @Get()
  @UseGuards(AccessTokenGuard)
  async getProfile(@User('id') userId: string) {
    const userData = await this.userService.findOne(userId);
    delete userData.password;
    delete userData.token;

    return userData;
  }
}
