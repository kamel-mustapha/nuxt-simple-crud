import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/modules/auth/guards/auth/auth.guard';
import { CrecheService } from '../service/creche.service';
import { CreateCrecheDto } from '../dto/create-creche.dto';
import { UpdateCrecheDto } from '../dto/update-creche.dto';

@Controller()
@UseGuards(AuthGuard)
export class CrecheController {
  constructor(private readonly service: CrecheService) {}
  @HttpCode(201)
  @Post()
  create(@Req() req, @Body() body: CreateCrecheDto) {
    body.userId = req.userId;
    const creche = this.service.create(body);
    return creche;
  }

  @HttpCode(200)
  @Get()
  findAll(@Req() req) {
    return this.service.findAll(req.userId);
  }

  @HttpCode(200)
  @Get(':id')
  findOne(@Req() req, @Param('id') id: number) {
    return this.service.findById(req.userId, id);
  }

  @HttpCode(200)
  @Put(':id')
  update(
    @Req() req,
    @Param('id') id: number,
    @Body() updateDto: UpdateCrecheDto,
  ) {
    return this.service.update(req.userId, +id, updateDto);
  }

  @HttpCode(204)
  @Delete(':id')
  remove(@Req() req, @Param('id') id: string) {
    return this.service.delete(req.userId, +id);
  }

  @HttpCode(200)
  @Get(':id/children')
  findCrecheChildrens(@Req() req, @Param('id') id: number) {
    return this.service.findCrecheChildrens(req.userId, +id);
  }

  @HttpCode(204)
  @Delete(':id/child/:childId')
  deleteChildFromCreche(
    @Req() req,
    @Param('id') id: number,
    @Param('childId') childId: number,
  ) {
    return this.service.deleteChildFromCreche(req.userId, +id, +childId);
  }
}
