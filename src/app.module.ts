import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module';
import { ReviewModule } from './modules/review/review.module';
// import { ReadingProgressModule } from './modules/reading-progress/reading-progress.module';
import { GenreModule } from './modules/genre/genre.module';
import { ChapterModule } from './modules/chapter/chapter.module';
import { BookModule } from './modules/book/book.module';

import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { JwtAuthGuard } from './auth/passport/jwt-auth.guard';

@Module({
  imports: [
    BookModule,
    ChapterModule,
    GenreModule,
    // ReadingProgressModule,
    ReviewModule,
    UsersModule,
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
      }),
      inject: [ConfigService],
    }),
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
