import { useEffect, useRef } from 'react';
import { useGameStore } from '../store/gameStore';

export function useGameLoop() {
  const workerRef = useRef<Worker | null>(null);

  useEffect(() => {
    const worker = new Worker(new URL('../workers/ticker.ts', import.meta.url), { type: 'module' });
    workerRef.current = worker;

    workerRef.current.onmessage = () => {
      useGameStore.getState().tick();
    };

    return () => {
      workerRef.current?.terminate();
    };
  }, []);
}
