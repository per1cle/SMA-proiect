import { MessageType, Reason, ScanEntry, ScanSource, Status } from '../../domain/model/Models';
import { ScanEntity } from '../local/AppDatabase';

export function toEntity(entry: ScanEntry): ScanEntity {
  return {
    id: entry.id,
    text: entry.text,
    type: entry.type,
    source: entry.source,
    sender: entry.sender ?? null,
    subject: entry.subject ?? null,
    status: entry.result.status,
    riskScore: entry.result.riskScore,
    reasonsJson: JSON.stringify(entry.result.reasons),
    advice: entry.result.advice,
    modelVersion: entry.result.modelVersion,
    note: entry.note,
    reported: entry.reported ? 1 : 0,
    falsePositive: entry.falsePositive ? 1 : 0,
    createdAt: entry.createdAt,
  };
}

export function toDomainScan(entity: ScanEntity): ScanEntry {
  let reasons: Reason[] = [];
  try {
    reasons = JSON.parse(entity.reasonsJson) as Reason[];
  } catch {
    reasons = [];
  }

  return {
    id: entity.id,
    text: entity.text,
    type: (entity.type as MessageType) || 'SMS',
    source: (entity.source as ScanSource) || 'PASTE',
    sender: entity.sender,
    subject: entity.subject,
    result: {
      status: (entity.status as Status) || 'UNKNOWN',
      riskScore: entity.riskScore,
      reasons,
      advice: entity.advice,
      modelVersion: entity.modelVersion,
    },
    note: entity.note,
    reported: Boolean(entity.reported),
    falsePositive: Boolean(entity.falsePositive),
    createdAt: entity.createdAt,
  };
}
