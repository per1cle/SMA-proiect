import { getDatabase, ScanEntity } from './AppDatabase';

export class ScanDao {
  async insert(entity: Omit<ScanEntity, 'id'>): Promise<number> {
    const db = await getDatabase();
    const res = await db.runAsync(
      `INSERT INTO scan_entries (
        text, type, source, sender, subject, status, riskScore,
        reasonsJson, advice, modelVersion, note, reported, falsePositive, createdAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      entity.text,
      entity.type,
      entity.source,
      entity.sender,
      entity.subject,
      entity.status,
      entity.riskScore,
      entity.reasonsJson,
      entity.advice,
      entity.modelVersion,
      entity.note,
      entity.reported,
      entity.falsePositive,
      entity.createdAt
    );
    return res.lastInsertRowId;
  }

  async getAll(): Promise<ScanEntity[]> {
    const db = await getDatabase();
    return db.getAllAsync<ScanEntity>('SELECT * FROM scan_entries ORDER BY createdAt DESC');
  }

  async getById(id: number): Promise<ScanEntity | null> {
    const db = await getDatabase();
    return db.getFirstAsync<ScanEntity>('SELECT * FROM scan_entries WHERE id = ?', id);
  }

  async search(status: string | null, query: string): Promise<ScanEntity[]> {
    const db = await getDatabase();
    const q = query.trim();
    return db.getAllAsync<ScanEntity>(
      `SELECT * FROM scan_entries
       WHERE (? IS NULL OR status = ?)
         AND (? = '' OR text LIKE '%' || ? || '%' OR sender LIKE '%' || ? || '%')
       ORDER BY createdAt DESC`,
      status,
      status,
      q,
      q,
      q
    );
  }

  async update(entity: ScanEntity): Promise<void> {
    const db = await getDatabase();
    await db.runAsync(
      `UPDATE scan_entries SET
        text = ?, type = ?, source = ?, sender = ?, subject = ?,
        status = ?, riskScore = ?, reasonsJson = ?, advice = ?,
        modelVersion = ?, note = ?, reported = ?, falsePositive = ?, createdAt = ?
       WHERE id = ?`,
      entity.text,
      entity.type,
      entity.source,
      entity.sender,
      entity.subject,
      entity.status,
      entity.riskScore,
      entity.reasonsJson,
      entity.advice,
      entity.modelVersion,
      entity.note,
      entity.reported,
      entity.falsePositive,
      entity.createdAt,
      entity.id
    );
  }

  async deleteById(id: number): Promise<void> {
    const db = await getDatabase();
    await db.runAsync('DELETE FROM scan_entries WHERE id = ?', id);
  }

  async deleteAll(): Promise<void> {
    const db = await getDatabase();
    await db.runAsync('DELETE FROM scan_entries');
  }
}
