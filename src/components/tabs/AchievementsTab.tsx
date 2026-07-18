import { useGameStore } from '../../store/gameStore';
import { ACHIEVEMENTS } from '../../engine/data/achievements';
import { computeAchievementBonuses } from '../../engine/achievements';

function AchievementsTab() {
  const achievements = useGameStore(s => s.player.achievements);
  const state = useGameStore(s => s);
  const bonuses = computeAchievementBonuses(state);
  const earnedCount = Object.values(achievements).filter(Boolean).length;

  return (
    <div>
      <h3>Achievements</h3>
      <p style={{ marginBottom: 16 }}>
        Earned: {earnedCount} / {ACHIEVEMENTS.length}
      </p>

      <div style={{ marginBottom: 16 }}>
        <h4>Active Bonuses</h4>
        <ul>
          <li>XP Multiplier: {(bonuses.xpMultiplier).toFixed(3)}x</li>
          <li>Income Multiplier: {(bonuses.incomeMultiplier).toFixed(3)}x</li>
          <li>Happiness Multiplier: {(bonuses.happinessMultiplier).toFixed(3)}x</li>
          <li>Evil Multiplier: {(bonuses.evilMultiplier).toFixed(3)}x</li>
        </ul>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 8 }}>
        {ACHIEVEMENTS.map(ach => {
          const earned = !!achievements[ach.id];
          return (
            <div
              key={ach.id}
              style={{
                padding: 12,
                border: `1px solid ${earned ? '#4caf50' : '#555'}`,
                borderRadius: 6,
                opacity: earned ? 1 : 0.5,
                backgroundColor: earned ? 'rgba(76, 175, 80, 0.05)' : 'transparent',
              }}
            >
              <div style={{ fontWeight: 'bold' }}>
                {earned ? '✓ ' : '○ '}{ach.name}
              </div>
              <div style={{ fontSize: 13, marginTop: 4 }}>{ach.description}</div>
              <div style={{ fontSize: 12, marginTop: 4, color: '#888' }}>
                Bonus: +{(ach.bonus.value * 100).toFixed(1)}% {ach.bonus.type.replace('Multiplier', '')}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default AchievementsTab;
