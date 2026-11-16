import { ScanEntry, Status } from '../../domain/model/Models';
import { ScanDao } from '../local/ScanDao';
import { toDomainScan, toEntity } from '../mapper/ScanMapper';

export interface ScanHistoryRepository {
  add(entry: ScanEntry): Promise<number>;
  getAll(): Promise<ScanEntry[]>;
  getById(id: number): Promise<ScanEntry | null>;
  search(status: Status | null, query: string): Promise<ScanEntry[]>;
  update(entry: ScanEntry): Promise<void>;
  delete(id: number): Promise<void>;
  clear(): Promise<void>;
}

export class ScanHistoryRepositoryImpl implements ScanHistoryRepository {
  constructor(private readonly dao: ScanDao) { }

  async add(entry: ScanEntry): Promise<number> {
    const { id: _id, ...entityWithoutId } = toEntity(entry);
    return this.dao.insert(entityWithoutId);
  }

  async getAll(): Promise<ScanEntry[]> {
    const rows = await this.dao.getAll();
    return rows.map(toDomainScan);
  }

  async getById(id: number): Promise<ScanEntry | null> {
    const row = await this.dao.getById(id);
    return row ? toDomainScan(row) : null;
  }

  async search(status: Status | null, query: string): Promise<ScanEntry[]> {
    const rows = await this.dao.search(status, query);
    return rows.map(toDomainScan);
  }

  async update(entry: ScanEntry): Promise<void> {
    await this.dao.update(toEntity(entry));
  }

  async delete(id: number): Promise<void> {
    await this.dao.deleteById(id);
  }

  async clear(): Promise<void> {
    await this.dao.deleteAll();
  }
}
