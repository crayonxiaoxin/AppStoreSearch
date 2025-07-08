import { Controller, Get } from '@nestjs/common';
import { CountryService } from './country.service';
import { ApiConsumes, ApiOperation } from '@nestjs/swagger';

@Controller('country')
export class CountryController {
  constructor(private readonly countryService: CountryService) {}

  @Get()
  @ApiOperation({ summary: 'Countries' })
  @ApiConsumes('application/x-www-form-urlencoded')
  async getCountries() {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this.countryService.getCountries();
  }
}
