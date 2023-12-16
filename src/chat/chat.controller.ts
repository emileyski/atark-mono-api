import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { AccessTokenGuard } from 'src/core/guards/access-token.guard';
import { UserId } from 'src/core/decorators/user-id.decorator';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('chat')
@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @ApiBearerAuth()
  @UseGuards(AccessTokenGuard)
  @Post()
  create(@Body() createChatDto: CreateChatDto, @UserId() userId: string) {
    return this.chatService.create(userId, createChatDto);
  }

  //метод для поиска чатов, в которых участвует пользователь
  @ApiBearerAuth()
  @UseGuards(AccessTokenGuard)
  @Get()
  findAll(@UserId() userId: string) {
    return this.chatService.findAll(userId);
  }

  @ApiBearerAuth()
  @UseGuards(AccessTokenGuard)
  @Get(':id')
  findOne(@Param('id') id: string, @UserId() userId: string) {
    return this.chatService.findOne(id, userId);
  }

  @ApiBearerAuth()
  @UseGuards(AccessTokenGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @UserId() userId: string) {
    return this.chatService.remove(id, userId);
  }
}
