import CryptoJS from 'crypto-js';

/**
 * 生成 SHA-256 哈希指纹
 */
export const generateHash = (previousHash: string, currentData: any): string => {
  const dataString = JSON.stringify(currentData, Object.keys(currentData).sort());
  const chainString = previousHash + dataString;
  return CryptoJS.SHA256(chainString).toString();
};

/**
 * 测试哈希链功能
 */
export const testHashChain = () => {
  console.log('🧪 开始测试哈希链...');
  
  // 第一条记录
  const record1 = {
    weight: 1.5,
    price: 50,
    product_name: 'Apple'
  };
  const hash1 = generateHash('', record1);
  console.log('✅ 第一条记录哈希:', hash1);
  
  // 第二条记录
  const record2 = {
    weight: 2.0,
    price: 80,
    product_name: 'Banana'
  };
  const hash2 = generateHash(hash1, record2);
  console.log('✅ 第二条记录哈希:', hash2);
  
  // 验证哈希
  const isValid = generateHash(hash1, record2) === hash2;
  console.log('✅ 哈希验证:', isValid ? '通过 ✅' : '失败 ❌');
  
  return { hash1, hash2, isValid };
};