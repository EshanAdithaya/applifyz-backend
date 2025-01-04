import { EntityRepository, Repository } from 'typeorm';
import { ThresholdEntity } from '../entities/threshold.entity';

@EntityRepository(ThresholdEntity)
export class ThresholdRepository extends Repository<ThresholdEntity> {
  async findActiveThresholdByServerId(serverId: string): Promise<ThresholdEntity | undefined> {
    return this.findOne({
      where: {
        serverId,
        isActive: true,
      },
    });
  }

  async updateLastNotificationTime(id: string): Promise<void> {
    await this.update(id, {
      lastNotificationSent: new Date(),
    });
  }

  async deactivateOldThresholds(serverId: string): Promise<void> {
    await this.update(
      {
        serverId,
        isActive: true,
      },
      {
        isActive: false,
      }
    );
  }
}