import { useEffect, useRef } from 'react';
import { useGameStore } from '../store/gameStore';

export function useGameLoop() {
  const workerRef = useRef<Worker | null>(null);

  useEffect(() => {
    workerRef.current = new Worker('/ticker.worker.js');

    workerRef.current.onmessage = () => {
      useGameStore.getState().tick();
    };

    return () => {
      workerRef.current?.terminate();
    };
  }, []);
}
