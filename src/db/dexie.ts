import Dexie, { Table } from 'dexie';

export interface WeighingRecord {
  id?: string;
  store_id: string;
  user_id: string;
  weight: number;
  price: number;
  product_name: string;
  previous_hash: string;      // ✅ 确保有这个字段
  current_hash: string;       // ✅ 确保有这个字段
  is_tampered: boolean;
  sync_status: 'pending' | 'synced' | 'failed';
  created_at: string;
}

class PosDatabase extends Dexie {
  weighingRecords!: Table<WeighingRecord>;

  constructor() {
    super('NiagaProDB');
    this.version(1).stores({
      weighingRecords: 'id, store_id, user_id, sync_status, created_at, previous_hash, current_hash',
    });
  }
}

export const db = new PosDatabase();