import { Module } from '@nestjs/common';
import { AdminPanelController } from './admin-panel.controller';
import { AdminPanelService } from './admin-panel.service';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [UserModule],
  controllers: [AdminPanelController],
  providers: [AdminPanelService],
})
export class AdminPanelModule {}
