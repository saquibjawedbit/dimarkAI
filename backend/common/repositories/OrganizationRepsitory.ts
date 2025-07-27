
import { OrganizationModel, IOrganization } from '../models/Organization';
import { BaseRepository } from './BaseRepository';

export class OrganizationRepository extends BaseRepository<IOrganization> {
  constructor() {
    super(OrganizationModel);
  }

  async findByUserId(userId: string): Promise<IOrganization | null> {
    return this.model.findOne({ userId }).exec();
  }

  async upsertByUserId(userId: string, data: Partial<IOrganization>): Promise<IOrganization> {
    const org = await this.model.findOneAndUpdate(
      { userId },
      { $set: data },
      { new: true, upsert: true }
    ).exec();
    return org!;
  }
}
