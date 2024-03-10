import { CacheModule } from '@nestjs/cache-manager'
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { APP_FILTER, APP_GUARD } from '@nestjs/core'
import {
  JwtAuthGuard,
  JwtAuthModule,
  RolesGuard,
  RolesModule
} from '@libs/auth'
import { CacheConfigService } from '@libs/cache'
import { ExceptionsFilter } from '@libs/exception'
import { PrismaModule } from '@libs/prisma'
import { StorageModule } from '@libs/storage'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { AttendanceModule } from './attendance/attendance.module'
import { AuthModule } from './auth/auth.module'
import { RosterModule } from './roster/roster.module'
import { SurveyModule } from './survey/survey.module'
import { UserModule } from './user/user.module'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    CacheModule.registerAsync({
      isGlobal: true,
      useClass: CacheConfigService
    }),
    AuthModule,
    PrismaModule,
    JwtAuthModule,
    UserModule,
    RolesModule,
    StorageModule,
    RosterModule,
    SurveyModule,
    AttendanceModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_FILTER, useClass: ExceptionsFilter },
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: RolesGuard }
  ]
})
export class AppModule {}
