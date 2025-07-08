import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ItunesModule } from './itunes/itunes.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { CountryModule } from './country/country.module';

@Module({
  imports: [
    // 静态目录 - 前端打包后的目录
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'client', 'dist'),
    }),
    ItunesModule,
    CountryModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
