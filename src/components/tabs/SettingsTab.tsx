import { useState } from 'react';
import { useGameStore } from '../../store/gameStore';

function SettingsTab() {
  const [saveText, setSaveText] = useState('');
  const [saveFeedback, setSaveFeedback] = useState<{ type: 'error' | 'success'; text: string } | null>(null);

  return (
    <div>
      <h3>Settings</h3>

      <div style={{ marginBottom: 16 }}>
        <textarea
          rows={4}
          cols={50}
          value={saveText}
          onChange={e => setSaveText(e.target.value)}
          placeholder="Paste save data here..."
        />
        <div style={{ marginTop: 8 }}>
          <button className="button" onClick={() => {
            const result = useGameStore.getState().importSaveData(saveText);
            if (result === null) {
              setSaveFeedback({ type: 'success', text: 'Save imported successfully!' });
            } else {
              setSaveFeedback({ type: 'error', text: result });
            }
            setTimeout(() => setSaveFeedback(null), 5000);
          }} style={{ marginRight: 8 }}>
            Import
          </button>
          <button className="button" onClick={() => setSaveText(useGameStore.getState().exportSaveData())}>
            Export
          </button>
        </div>
        {saveFeedback && (
          <div style={{ color: saveFeedback.type === 'error' ? 'red' : 'green', marginTop: 8 }}>
            {saveFeedback.text}
          </div>
        )}
      </div>

      <div style={{ marginBottom: 16 }}>
        <button className="button" onClick={() => {
          const isDark = document.body.classList.toggle('dark');
          localStorage.setItem('darkMode', String(isDark));
        }}>
          Toggle dark theme
        </button>
      </div>

      <div style={{ marginBottom: 16 }}>
        <button
          className="button"
          onClick={() => {
            if (confirm('Reset all progress? This cannot be undone!')) {
              useGameStore.getState().resetGame();
            }
          }}
        >
          Hard reset
        </button>
      </div>

    </div>
  );
}

export default SettingsTab;
