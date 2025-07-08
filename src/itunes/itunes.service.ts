/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable } from '@nestjs/common';
import { ItunesQueryDto } from './itunes.query.dto';
import axios from 'axios';

@Injectable()
export class ItunesService {
  constructor() {}

  async search(query: ItunesQueryDto) {
    const apiUrl = `https://itunes.apple.com/search`;
    try {
      const response = await axios.get(apiUrl, { params: query });
      const result = response?.data;
      // console.log(response?.data);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return result;
    } catch (error) {
      console.log(error);
      return { error: error };
    }
  }
}
