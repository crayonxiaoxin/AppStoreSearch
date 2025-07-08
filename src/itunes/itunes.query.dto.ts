import { ApiProperty, ApiPropertyOptional, ApiSchema } from '@nestjs/swagger';

@ApiSchema()
export class ItunesQueryDto {
  @ApiProperty()
  term: string;

  @ApiProperty({
    default: 'us',
    description: 'https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2',
  })
  country: string;

  @ApiProperty({
    default: 'software',
    enum: [
      'movie',
      'podcast',
      'music',
      'musicVideo',
      'audiobook',
      'shortFilm',
      'tvShow',
      'software',
      'ebook',
      'all',
    ],
  })
  media: string;

  @ApiPropertyOptional({ default: 20 })
  limit: number;
}
