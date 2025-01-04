import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServerMonitorController } from './server-monitor.controller';
import { ServerMonitorService } from './server-monitor.service';
import { ThresholdEntity } from './entities/threshold.entity.ts';

@Module({
  imports: [
    HttpModule,
    ConfigModule,
    TypeOrmModule.forFeature([ThresholdEntity]),
  ],
  controllers: [ServerMonitorController],
  providers: [ServerMonitorService],
  exports: [ServerMonitorService],
})
export class ServerMonitorModule {}