import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiConsumes } from '@nestjs/swagger';
import { ItunesQueryDto } from './itunes.query.dto';
import { ItunesService } from './itunes.service';

@Controller('itunes')
export class ItunesController {
  constructor(private readonly itunesService: ItunesService) {}

  @Get('search')
  @ApiOperation({ summary: 'Search' })
  @ApiConsumes('application/x-www-form-urlencoded')
  async search(@Query() query: ItunesQueryDto) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this.itunesService.search(query);
  }
}
