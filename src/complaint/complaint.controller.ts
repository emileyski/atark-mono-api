import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ComplaintService } from './complaint.service';
import { AccessTokenGuard } from 'src/core/guards/access-token.guard';
import { Role } from 'src/core/decorators/role.decorator';
import { Roles } from 'src/core/enums/roles.enum';
import { ApiTags } from '@nestjs/swagger';
import { ComplaintStatusTypes } from 'src/core/enums/complaint-status.enum';

@ApiTags('complaint')
@Controller('complaint')
export class ComplaintController {
  constructor(private readonly complaintService: ComplaintService) {}

  @UseGuards(AccessTokenGuard)
  @Role(Roles.ADMIN)
  @Get()
  findAll() {
    return this.complaintService.findAll();
  }

  @UseGuards(AccessTokenGuard)
  @Role(Roles.ADMIN)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.complaintService.findOne(id);
  }

  @UseGuards(AccessTokenGuard)
  @Role(Roles.ADMIN)
  @Patch(':id/verdict')
  makeVerdict(
    @Param('id') id: string,
    @Body('verdict') verdict: string,
    @Body('status') status: ComplaintStatusTypes,
  ) {
    return this.complaintService.makeVerdict(id, verdict, status);
  }

  @UseGuards(AccessTokenGuard)
  @Role(Roles.ADMIN)
  @Patch(':id/status')
  changeStatus(
    @Param('id') id: string,
    @Body('status') status: ComplaintStatusTypes,
  ) {
    return this.complaintService.changeStatus(id, status);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.complaintService.remove(+id);
  }
}
