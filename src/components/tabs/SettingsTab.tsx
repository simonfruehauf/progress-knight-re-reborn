import { useState } from 'react';
import { useGameStore } from '../../store/gameStore';

function SettingsTab() {
  const [saveText, setSaveText] = useState('');

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
          <button className="button" onClick={() => useGameStore.getState().importSaveData(saveText)} style={{ marginRight: 8 }}>
            Import
          </button>
          <button className="button" onClick={() => setSaveText(useGameStore.getState().exportSaveData())}>
            Export
          </button>
        </div>
      </div>

      <div style={{ marginBottom: 16 }}>
        <button className="button" onClick={() => document.body.classList.toggle('dark')}>
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

      <div>
        <h2>Join the discord community!</h2>
        <a href="https://discord.gg/fTRS4pHGka" target="_blank">Discord</a>
      </div>
    </div>
  );
}

export default SettingsTab;
