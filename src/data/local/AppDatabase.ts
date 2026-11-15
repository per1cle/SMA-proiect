import * as SQLite from 'expo-sqlite';

export interface ScanEntity {
  id: number;
  text: string | null;
  type: string;
  source: string;
  sender: string | null;
  subject: string | null;
  status: string;
  riskScore: number;
  reasonsJson: string;
  advice: string;
  modelVersion: string;
  note: string;
  reported: number; // 0 or 1 in SQLite
  falsePositive: number; // 0 or 1 in SQLite
  createdAt: number;
}

let dbInstance: SQLite.SQLiteDatabase | null = null;

export async function getDatabase(): Promise<SQLite.SQLiteDatabase> {
  if (dbInstance) return dbInstance;
  const db = await SQLite.openDatabaseAsync('smish.db');
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS scan_entries (
      id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
      text TEXT,
      type TEXT NOT NULL,
      source TEXT NOT NULL,
      sender TEXT,
      subject TEXT,
      status TEXT NOT NULL,
      riskScore REAL NOT NULL,
      reasonsJson TEXT NOT NULL,
      advice TEXT NOT NULL,
      modelVersion TEXT NOT NULL,
      note TEXT NOT NULL DEFAULT '',
      reported INTEGER NOT NULL DEFAULT 0,
      falsePositive INTEGER NOT NULL DEFAULT 0,
      createdAt INTEGER NOT NULL
    );
  `);
  dbInstance = db;
  return db;
}
