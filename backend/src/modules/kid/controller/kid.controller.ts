import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/modules/auth/guards/auth/auth.guard';
import { KidService } from '../service/kid.service';
import { CreateKidDto } from '../dto/create-kid.dto';
import { UpdateKidDto } from '../dto/update-kid.dto';

@Controller()
@UseGuards(AuthGuard)
export class KidController {
  constructor(private readonly service: KidService) {}
  @HttpCode(201)
  @Post()
  create(@Req() req, @Body() body: CreateKidDto) {
    body.userId = req.userId;
    const kid = this.service.create(body);
    return kid;
  }

  @HttpCode(200)
  @Get()
  findAll(@Req() req) {
    return this.service.findAll(req.userId);
  }

  @HttpCode(200)
  @Get('export.csv')
  exportChildren(@Req() req, @Res() res, @Query('crecheId') crecheId: number) {
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="children.csv"');
    return this.service.exportChildren(req.userId, crecheId, res);
  }

  @HttpCode(200)
  @Get(':id')
  findOne(@Req() req, @Param('id') id: number) {
    return this.service.findById(req.userId, id);
  }

  @HttpCode(200)
  @Put(':id')
  update(@Req() req, @Param('id') id: number, @Body() updateDto: UpdateKidDto) {
    return this.service.update(req.userId, id, updateDto);
  }

  @HttpCode(204)
  @Delete(':id')
  remove(@Req() req, @Param('id') id: string) {
    return this.service.delete(req.userId, +id);
  }
}
