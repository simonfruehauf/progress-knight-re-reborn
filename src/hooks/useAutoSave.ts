import { useEffect } from 'react';
import { useGameStore } from '../store/gameStore';

export function useAutoSave(intervalMs = 3000) {
  useEffect(() => {
    const id = setInterval(() => {
      useGameStore.getState().saveGame();
    }, intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);
}
