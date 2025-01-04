import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { ServerMetricsDTO } from './types/server-metrics.dto';
import { ThresholdDTO } from './types/threshold.dto';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class ServerMonitorService {
  saveThresholds(threshold: ThresholdDTO) {
      throw new Error('Method not implemented.');
  }
  private readonly logger = new Logger(ServerMonitorService.name);

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  async fetchGrafanaMetrics(serverId: string): Promise<ServerMetricsDTO> {
    try {
      const grafanaUrl = this.configService.get<string>('GRAFANA_API_URL');
      const apiKey = this.configService.get<string>('GRAFANA_API_KEY');

      const headers = {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      };

      // Fetch memory metrics
      const memoryResponse = await lastValueFrom(
        this.httpService.post(
          `${grafanaUrl}/api/ds/query`,
          {
            queries: [
              {
                refId: 'A',
                datasource: { type: 'prometheus' },
                expr: 'node_memory_MemTotal_bytes',
                instant: true,
              },
              {
                refId: 'B',
                datasource: { type: 'prometheus' },
                expr: 'node_memory_MemFree_bytes',
                instant: true,
              },
            ],
          },
          { headers },
        ),
      );

      // Fetch storage metrics
      const storageResponse = await lastValueFrom(
        this.httpService.post(
          `${grafanaUrl}/api/ds/query`,
          {
            queries: [
              {
                refId: 'C',
                datasource: { type: 'prometheus' },
                expr: 'node_filesystem_size_bytes{mountpoint="/"}',
                instant: true,
              },
              {
                refId: 'D',
                datasource: { type: 'prometheus' },
                expr: 'node_filesystem_free_bytes{mountpoint="/"}',
                instant: true,
              },
            ],
          },
          { headers },
        ),
      );

      // Process memory metrics
      const totalMemory = memoryResponse.data.results.A.frames[0].data.values[0];
      const freeMemory = memoryResponse.data.results.B.frames[0].data.values[0];
      const usedMemory = totalMemory - freeMemory;
      const memoryPercentUsed = (usedMemory / totalMemory) * 100;

      // Process storage metrics
      const totalStorage = storageResponse.data.results.C.frames[0].data.values[0];
      const freeStorage = storageResponse.data.results.D.frames[0].data.values[0];
      const usedStorage = totalStorage - freeStorage;
      const storagePercentUsed = (usedStorage / totalStorage) * 100;

      return {
        serverId,
        hostname: await this.getHostname(serverId),
        memoryUsage: {
          total: totalMemory,
          used: usedMemory,
          free: freeMemory,
          percentUsed: memoryPercentUsed,
        },
        storageUsage: {
          total: totalStorage,
          used: usedStorage,
          free: freeStorage,
          percentUsed: storagePercentUsed,
        },
        timestamp: new Date(),
      };
    } catch (error) {
      this.logger.error(`Error fetching metrics for server ${serverId}:`, error);
      throw error;
    }
  }

  private async getHostname(serverId: string): Promise<string> {
    // Implement hostname lookup logic
    return `server-${serverId}`;
  }

  async checkThresholds(metrics: ServerMetricsDTO, threshold: ThresholdDTO): Promise<void> {
    try {
      const alerts = [];

      if (metrics.memoryUsage.percentUsed > threshold.memoryThreshold) {
        alerts.push({
          type: 'memory',
          current: metrics.memoryUsage.percentUsed,
          threshold: threshold.memoryThreshold,
        });
      }

      if (metrics.storageUsage.percentUsed > threshold.storageThreshold) {
        alerts.push({
          type: 'storage',
          current: metrics.storageUsage.percentUsed,
          threshold: threshold.storageThreshold,
        });
      }

      if (alerts.length > 0) {
        await this.triggerAlerts(metrics, threshold, alerts);
      }
    } catch (error) {
      this.logger.error(`Error checking thresholds for server ${metrics.serverId}:`, error);
      throw error;
    }
  }

  private async triggerAlerts(
    metrics: ServerMetricsDTO,
    threshold: ThresholdDTO,
    alerts: Array<{ type: string; current: number; threshold: number }>,
  ): Promise<void> {
    const notificationService = await this.getNotificationService();
    
    // Prepare alert message
    const message = this.formatAlertMessage(metrics, alerts);

    // Send notifications based on severity
    if (alerts.some(alert => alert.current > alert.threshold * 1.5)) {
      // Critical alerts - use all notification methods
      await Promise.all([
        notificationService.sendEmails(threshold.emailNotifications, message),
        notificationService.sendSMS(threshold.smsNotifications, message),
        notificationService.makePhoneCalls(threshold.phoneNotifications, message),
      ]);
    } else {
      // Warning alerts - email only
      await notificationService.sendEmails(threshold.emailNotifications, message);
    }
  }

  private formatAlertMessage(
    metrics: ServerMetricsDTO,
    alerts: Array<{ type: string; current: number; threshold: number }>,
  ): string {
    return `
Server Alert: ${metrics.hostname}
Time: ${metrics.timestamp.toISOString()}
${alerts
  .map(
    alert =>
      `${alert.type.toUpperCase()} Usage: ${alert.current.toFixed(2)}% (Threshold: ${alert.threshold}%)`,
  )
  .join('\n')}
    `.trim();
  }

  private async getNotificationService() {
    // Implementation of notification service initialization
    return {
      sendEmails: async (recipients: string[], message: string) => {
        // Implement email sending logic
      },
      sendSMS: async (recipients: string[], message: string) => {
        // Implement SMS sending logic
      },
      makePhoneCalls: async (recipients: string[], message: string) => {
        // Implement phone call logic
      },
    };
  }
}