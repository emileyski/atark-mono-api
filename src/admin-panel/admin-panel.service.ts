import { Injectable } from '@nestjs/common';

@Injectable()
export class AdminPanelService {
  async getAllUsers() {
    return 'getAllUsers';
  }
}
