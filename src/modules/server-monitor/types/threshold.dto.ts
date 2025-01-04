export interface ThresholdDTO {
    serverId: string;
    memoryThreshold: number;
    storageThreshold: number;
    emailNotifications: string[];
    smsNotifications: string[];
    phoneNotifications: string[];
  }