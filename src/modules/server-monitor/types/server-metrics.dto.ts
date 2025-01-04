import { ApiProperty } from '@nestjs/swagger';

export class MemoryUsageDTO {
  @ApiProperty({ description: 'Total memory in bytes' })
  total: number;

  @ApiProperty({ description: 'Used memory in bytes' })
  used: number;

  @ApiProperty({ description: 'Free memory in bytes' })
  free: number;

  @ApiProperty({ description: 'Percentage of memory used' })
  percentUsed: number;
}

export class StorageUsageDTO {
  @ApiProperty({ description: 'Total storage in bytes' })
  total: number;

  @ApiProperty({ description: 'Used storage in bytes' })
  used: number;

  @ApiProperty({ description: 'Free storage in bytes' })
  free: number;

  @ApiProperty({ description: 'Percentage of storage used' })
  percentUsed: number;
}

export class ServerMetricsDTO {
  @ApiProperty({ description: 'Unique identifier of the server' })
  serverId: string;

  @ApiProperty({ description: 'Hostname of the server' })
  hostname: string;

  @ApiProperty({ type: MemoryUsageDTO })
  memoryUsage: MemoryUsageDTO;

  @ApiProperty({ type: StorageUsageDTO })
  storageUsage: StorageUsageDTO;

  @ApiProperty({ description: 'Timestamp of the metrics collection' })
  timestamp: Date;
}
