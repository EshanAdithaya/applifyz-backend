export interface ServerMetricsDTO {
    serverId: string;
    hostname: string;
    memoryUsage: {
      total: number;
      used: number;
      free: number;
      percentUsed: number;
    };
    storageUsage: {
      total: number;
      used: number;
      free: number;
      percentUsed: number;
    };
    timestamp: Date;
  }
  
  