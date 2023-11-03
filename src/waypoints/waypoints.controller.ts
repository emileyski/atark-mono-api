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
import { ApiTags } from '@nestjs/swagger';

@ApiTags('waypoints')
@Controller('waypoints')
export class WaypointsController {
  constructor(private readonly waypointsService: WaypointsService) {}

  @Role(Roles.DRIVER)
  @Post(':orderId')
  create(
    @Param('orderId') orderId: number,
    @Body() createWaypointDto: CreateWaypointDto,
    @UserId() userId: string,
  ) {
    return this.waypointsService.create(createWaypointDto, orderId, userId);
  }

  @Get()
  findAll() {
    return this.waypointsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.waypointsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateWaypointDto: UpdateWaypointDto,
  ) {
    return this.waypointsService.update(+id, updateWaypointDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.waypointsService.remove(+id);
  }
}
