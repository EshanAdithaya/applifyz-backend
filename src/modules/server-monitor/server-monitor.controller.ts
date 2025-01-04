import { Controller, Get, Post, Body, Param, Logger } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { ServerMonitorService } from './server-monitor.service';
import { ServerMetricsDTO } from './types/server-metrics.dto';
import { ThresholdDTO } from './types/threshold.dto';

@ApiTags('Server Monitoring')
@Controller('server-monitor')
export class ServerMonitorController {
  private readonly logger = new Logger(ServerMonitorController.name);

  constructor(private readonly serverMonitorService: ServerMonitorService) {}

  @Get('metrics/:serverId')
  @ApiOperation({ summary: 'Get server metrics', description: 'Fetches current metrics for a specific server' })
  @ApiParam({ name: 'serverId', description: 'ID of the server to monitor' })
  @ApiResponse({ status: 200, description: 'Server metrics retrieved successfully', type: ServerMetricsDTO })
  @ApiResponse({ status: 404, description: 'Server not found' })
  @ApiResponse({ status: 500, description: 'Error fetching server metrics' })
  async getServerMetrics(@Param('serverId') serverId: string): Promise<ServerMetricsDTO> {
    this.logger.debug(`Fetching metrics for server ${serverId}`);
    return this.serverMonitorService.fetchGrafanaMetrics(serverId);
  }

  @Post('thresholds')
  @ApiOperation({ summary: 'Set monitoring thresholds', description: 'Configure alert thresholds and notification preferences' })
  @ApiResponse({ status: 201, description: 'Thresholds set successfully' })
  @ApiResponse({ status: 400, description: 'Invalid threshold configuration' })
  async setThresholds(@Body() threshold: ThresholdDTO): Promise<void> {
    this.logger.debug(`Setting thresholds for server ${threshold.serverId}`);
    await this.serverMonitorService.saveThresholds(threshold);
  }
}