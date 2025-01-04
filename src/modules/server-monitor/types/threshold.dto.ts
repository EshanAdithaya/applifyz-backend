export class ThresholdDTO {
    @ApiProperty({ description: 'Server ID to set thresholds for' })
    serverId: string;
  
    @ApiProperty({ 
      description: 'Memory usage threshold percentage',
      minimum: 0,
      maximum: 100
    })
    memoryThreshold: number;
  
    @ApiProperty({ 
      description: 'Storage usage threshold percentage',
      minimum: 0,
      maximum: 100
    })
    storageThreshold: number;
  
    @ApiProperty({ 
      description: 'Email addresses to notify',
      type: [String]
    })
    emailNotifications: string[];
  
    @ApiProperty({ 
      description: 'Phone numbers for SMS notifications',
      type: [String]
    })
    smsNotifications: string[];
  
    @ApiProperty({ 
      description: 'Phone numbers for voice calls',
      type: [String]
    })
    phoneNotifications: string[];
  }