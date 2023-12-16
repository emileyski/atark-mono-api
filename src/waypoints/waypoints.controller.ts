import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { WaypointsService } from './waypoints.service';
import { CreateWaypointDto } from './dto/create-waypoint.dto';
import { UpdateWaypointDto } from './dto/update-waypoint.dto';
import { Role } from 'src/core/decorators/role.decorator';
import { Roles } from 'src/core/enums/roles.enum';
import { UserId } from 'src/core/decorators/user-id.decorator';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('waypoints')
@Controller('waypoints')
export class WaypointsController {
  constructor(private readonly waypointsService: WaypointsService) {}

  @ApiBearerAuth()
  @Role(Roles.DRIVER)
  @Post(':orderId')
  create(
    @Param('orderId') orderId: number,
    @Body() createWaypointDto: CreateWaypointDto,
    @UserId() userId: string,
  ) {
    return this.waypointsService.create(createWaypointDto, orderId, userId);
  }
}
