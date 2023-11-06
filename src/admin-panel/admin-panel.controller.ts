import { Controller, Get } from '@nestjs/common';
import { AdminPanelService } from './admin-panel.service';
import { Role } from 'src/core/decorators/role.decorator';
import { Roles } from 'src/core/enums/roles.enum';
import { ApiTags } from '@nestjs/swagger';
import { UserService } from 'src/user/user.service';

@ApiTags('admin-panel')
@Controller('admin-panel')
export class AdminPanelController {
  constructor(
    private readonly adminPanelService: AdminPanelService,
    private readonly userService: UserService,
  ) {}

  @Role(Roles.ADMIN)
  @Get('users')
  async getAllUsers() {
    return await this.userService.getAll();
  }
}
