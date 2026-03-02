import { useState, useEffect, useCallback, useRef } from 'react';

export type WeightStatus = 'stable' | 'unstable';

interface UseWeightReturn {
  weight: number;
  weightStatus: WeightStatus;
  isConnected: boolean;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  isSimulating: boolean;
  toggleSimulation: () => void;
}

export function useWeight(): UseWeightReturn {
  const [weight, setWeight] = useState(0);
  const [weightStatus, setWeightStatus] = useState<WeightStatus>('unstable');
  const [isConnected, setIsConnected] = useState(false);
  const [isSimulating, setIsSimulating] = useState(true);
  
  const portRef = useRef<SerialPort | null>(null);
  const readerRef = useRef<ReadableStreamDefaultReader | null>(null);
  const lastWeightRef = useRef(0);
  const keepReadingRef = useRef(false);

  const checkStability = useCallback((newWeight: number) => {
    if (Math.abs(newWeight - lastWeightRef.current) < 0.005) {
      setWeightStatus('stable');
    } else {
      setWeightStatus('unstable');
    }
    lastWeightRef.current = newWeight;
  }, []);

  // 模拟模式
  useEffect(() => {
    if (!isSimulating || !isConnected) return;
    
    const interval = setInterval(() => {
      const simulatedWeight = 0.5 + Math.random() * 2;
      setWeight(Number(simulatedWeight.toFixed(3)));
      checkStability(simulatedWeight);
    }, 500);

    return () => clearInterval(interval);
  }, [isSimulating, isConnected, checkStability]);

  const connect = useCallback(async () => {
    if (!('serial' in navigator)) {
      alert('你的浏览器不支持 Web Serial API，请使用 Chrome 或 Edge！');
      return;
    }

    try {
      const port = await navigator.serial.requestPort();
      await port.open({ baudRate: 9600 });
      
      portRef.current = port;
      setIsConnected(true);
      setIsSimulating(false);
      keepReadingRef.current = true;

      // 创建新的 reader
      const reader = port.readable.getReader();
      readerRef.current = reader;
      
      let buffer = '';

      // 读取数据
      while (keepReadingRef.current) {
        const { value, done } = await reader.read();
        
        if (done) {
          break;
        }
        
        if (value) {
          buffer += value;
          const lines = buffer.split('\n');
          buffer = lines.pop() || '';
          
          for (const line of lines) {
            const match = line.match(/([0-9]+\.[0-9]+)/);
            if (match) {
              const newWeight = parseFloat(match[1]);
              if (!isNaN(newWeight)) {
                setWeight(newWeight);
                checkStability(newWeight);
              }
            }
          }
        }
      }
    } catch (error) {
      console.error('连接失败:', error);
      alert('连接失败，请检查电子秤是否通电并已连接 USB');
    }
  }, [checkStability]);

  const disconnect = useCallback(async () => {
    keepReadingRef.current = false;
    
    if (readerRef.current) {
      try {
        await readerRef.current.cancel();
      } catch (e) {
        console.error('取消 reader 失败:', e);
      }
      readerRef.current = null;
    }
    
    if (portRef.current) {
      try {
        await portRef.current.close();
      } catch (e) {
        console.error('关闭 port 失败:', e);
      }
      portRef.current = null;
    }
    
    setIsConnected(false);
    setWeight(0);
    setWeightStatus('unstable');
  }, []);

  const toggleSimulation = useCallback(() => {
    setIsSimulating(prev => !prev);
  }, []);

  return {
    weight,
    weightStatus,
    isConnected,
    connect,
    disconnect,
    isSimulating,
    toggleSimulation,
  };
}