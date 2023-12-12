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
import { UserId } from 'src/core/decorators/user-id.decorator';
import { RoleGuard } from 'src/core/guards/role.guard';
import { MakeVerdictDto } from './dto/make-verdict.dto';

@ApiTags('complaint')
@Controller('complaint')
export class ComplaintController {
  constructor(private readonly complaintService: ComplaintService) {}

  @UseGuards(AccessTokenGuard)
  @Get()
  findAllMyComplaints(@UserId() userId: string) {
    return this.complaintService.findAllMyComplaints(userId);
  }

  @UseGuards(AccessTokenGuard, RoleGuard)
  @Role(Roles.ADMIN)
  @Get('as-admin')
  findAll() {
    return this.complaintService.findAll();
  }

  @UseGuards(AccessTokenGuard, RoleGuard)
  @Role(Roles.ADMIN)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.complaintService.findOne(id);
  }

  @UseGuards(AccessTokenGuard, RoleGuard)
  @Role(Roles.ADMIN)
  @Patch('verdict')
  makeVerdict(@Body() makeVerdictDto: MakeVerdictDto) {
    return this.complaintService.makeVerdict(makeVerdictDto);
  }

  @UseGuards(AccessTokenGuard, RoleGuard)
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
