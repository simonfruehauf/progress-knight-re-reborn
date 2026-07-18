import Sidebar from './Sidebar';
import GameTabs from './GameTabs';
import { useGameLoop } from '../hooks/useGameLoop';
import { useAutoSave } from '../hooks/useAutoSave';

function App() {
  useGameLoop();
  useAutoSave(3000);

  return (
    <div className="app-container">
      <h1>Progress Knight - Reborn</h1>
      <div className="main-layout">
        <Sidebar />
        <GameTabs />
      </div>
    </div>
  );
}

export default App;
