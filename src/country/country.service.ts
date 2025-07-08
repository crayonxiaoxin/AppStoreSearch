import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class CountryService {
  async getCountries() {
    const apiUrl = `https://restcountries.com/v3.1/all`;
    try {
      const response = await axios.get(apiUrl, {
        params: { fields: 'capital,flags,cca2,cioc,name' },
      });
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const result = response?.data;
      // console.log(response?.data);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return result;
    } catch (error) {
      console.log(error);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      return { error: error };
    }
  }
}
