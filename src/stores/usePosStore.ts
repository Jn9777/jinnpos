import { create } from 'zustand';
import { db, WeighingRecord } from '../db/dexie';
import { generateHash } from '../utils/hashChain';
import { supabase } from '../lib/supabase';

interface PosState {
  cart: any[];
  lastHash: string | null;
  records: WeighingRecord[];
  addToCart: (item: any) => void;
  clearCart: () => void;
  saveWeighingRecord: (data: Omit<WeighingRecord, 'id' | 'created_at' | 'sync_status' | 'is_tampered'>) => Promise<void>;
  loadRecords: () => Promise<void>;
}

export const usePosStore = create<PosState>((set, get) => ({
  cart: [],
  lastHash: null,
  records: [],
  
  addToCart: (item) => set((state) => ({ cart: [...state.cart, item] })),
  
  clearCart: () => set({ cart: [] }),
  
  saveWeighingRecord: async (data) => {
    const { lastHash } = get();
    
    console.log('🔐 开始保存记录...');
    console.log('上一条哈希:', lastHash);
    console.log('当前数据:', data);
    
    // 1. 生成当前哈希
    const currentHash = generateHash(lastHash || '', {
      weight: data.weight,
      price: data.price,
      product_name: data.product_name,
      store_id: data.store_id,
      user_id: data.user_id
    });
    
    console.log('✅ 生成的新哈希:', currentHash);
    
    // 2. 构建完整记录（必须包含所有字段）
    const newRecord: WeighingRecord = {
      id: crypto.randomUUID(),
      store_id: data.store_id,
      user_id: data.user_id,
      weight: data.weight,
      price: data.price,
      product_name: data.product_name,
      previous_hash: lastHash || '',  // ✅ 必须有这个字段
      current_hash: currentHash,       // ✅ 必须有这个字段
      is_tampered: false,
      sync_status: 'pending',
      created_at: new Date().toISOString()
    };
    
    console.log('💾 完整记录（包含哈希）:', newRecord);
    
    // 3. 存入本地 Dexie
    try {
      await db.weighingRecords.add(newRecord);
      console.log('✅ 已保存到 IndexedDB');
    } catch (error) {
      console.error('❌ 保存到 IndexedDB 失败:', error);
    }
    
    // 4. 更新内存中的 lastHash
    set({ lastHash: currentHash });
    
    // 5. 尝试同步到云端
    try {
      const { error } = await supabase.from('weighing_records').insert([newRecord]);
      if (!error) {
        await db.weighingRecords.update(newRecord.id!, { sync_status: 'synced' });
        console.log('✅ 同步到 Supabase 成功');
      } else {
        console.error('❌ 同步到 Supabase 失败:', error);
      }
    } catch (e) {
      console.log('📴 离线状态或网络错误，已保存本地');
    }
  },
  
  loadRecords: async () => {
    const records = await db.weighingRecords.orderBy('created_at').reverse().toArray();
    
    if (records.length > 0) {
      const latestRecord = records[0];
      console.log('📂 加载本地记录，最新哈希:', latestRecord.current_hash);
      set({ lastHash: latestRecord.current_hash, records });
    } else {
      console.log('📂 没有找到本地记录');
    }
  }
}));