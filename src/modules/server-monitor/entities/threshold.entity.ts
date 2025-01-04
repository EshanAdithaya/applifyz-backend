import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Transform } from 'class-transformer';
import { IsString, IsNumber, IsArray, Min, Max, IsEmail, IsPhoneNumber } from 'class-validator';

@Entity('thresholds')
export class ThresholdEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'server_id', nullable: false })
  @IsString()
  serverId: string;

  @Column({ name: 'memory_threshold', type: 'decimal', precision: 5, scale: 2 })
  @IsNumber()
  @Min(0)
  @Max(100)
  memoryThreshold: number;

  @Column({ name: 'storage_threshold', type: 'decimal', precision: 5, scale: 2 })
  @IsNumber()
  @Min(0)
  @Max(100)
  storageThreshold: number;

  @Column({ name: 'email_notifications', type: 'simple-array', nullable: true })
  @IsArray()
  @IsEmail({}, { each: true })
  @Transform(({ value }) => value.filter(Boolean))
  emailNotifications: string[];

  @Column({ name: 'sms_notifications', type: 'simple-array', nullable: true })
  @IsArray()
  @IsPhoneNumber(undefined, { each: true })
  @Transform(({ value }) => value.filter(Boolean))
  smsNotifications: string[];

  @Column({ name: 'phone_notifications', type: 'simple-array', nullable: true })
  @IsArray()
  @IsPhoneNumber(undefined, { each: true })
  @Transform(({ value }) => value.filter(Boolean))
  phoneNotifications: string[];

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @Column({ name: 'notification_cooldown', type: 'integer', default: 300 })
  @IsNumber()
  @Min(60)  // Minimum 1 minute
  @Max(86400)  // Maximum 24 hours
  notificationCooldown: number;  // in seconds

  @Column({ name: 'last_notification_sent', type: 'timestamp with time zone', nullable: true })
  lastNotificationSent: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ name: 'created_by', nullable: true })
  createdBy: string;

  @Column({ name: 'updated_by', nullable: true })
  updatedBy: string;

  constructor(partial: Partial<ThresholdEntity>) {
    Object.assign(this, partial);
  }
}
