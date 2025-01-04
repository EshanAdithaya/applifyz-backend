import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { ServerMonitorController } from './server-monitor.controller';
import { ServerMonitorService } from './server-monitor.service';

@Module({
  imports: [
    HttpModule,
    ConfigModule,
  ],
  controllers: [ServerMonitorController],
  providers: [ServerMonitorService],
  exports: [ServerMonitorService],
})
export class ServerMonitorModule {}