import { useGameStore } from '../../store/gameStore';

function StatsTab() {
  const stats = useGameStore(s => s.player.stats);

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours}h ${minutes}m ${seconds}s`;
  };

  return (
    <div>
      <h3>Statistics</h3>
      <table className="w3-table">
        <tbody>
          <tr><td>Time played</td><td>{formatTime(stats.timePlayedMs)}</td></tr>
          <tr><td>Total coins earned</td><td>{Math.floor(stats.totalCoinsEarned).toLocaleString()}</td></tr>
          <tr><td>Highest balance</td><td>{Math.floor(stats.highestSingleCoinBalance).toLocaleString()}</td></tr>
          <tr><td>Town buildings purchased</td><td>{stats.totalTownBuildingsPurchased}</td></tr>
        </tbody>
      </table>
    </div>
  );
}

export default StatsTab;
