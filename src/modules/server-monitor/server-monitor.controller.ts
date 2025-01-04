import { Controller, Get, Post, Body, Param, Logger } from '@nestjs/common';
import { ServerMonitorService } from './server-monitor.service';
import { ServerMetricsDTO } from './types/server-metrics.dto';
import { ThresholdDTO } from './types/threshold.dto';

@Controller('server-monitor')
export class ServerMonitorController {
  private readonly logger = new Logger(ServerMonitorController.name);

  constructor(private readonly serverMonitorService: ServerMonitorService) {}

  @Get('metrics/:serverId')
  async getServerMetrics(@Param('serverId') serverId: string): Promise<ServerMetricsDTO> {
    this.logger.debug(`Fetching metrics for server ${serverId}`);
    return this.serverMonitorService.fetchGrafanaMetrics(serverId);
  }

  @Post('thresholds')
  async setThresholds(@Body() threshold: ThresholdDTO): Promise<void> {
    this.logger.debug(`Setting thresholds for server ${threshold.serverId}`);
    // Implementation of threshold storage logic
  }
}
