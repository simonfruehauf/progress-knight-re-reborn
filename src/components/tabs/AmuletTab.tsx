import { useGameStore } from '../../store/gameStore';
import { getEvilGain } from '../../engine/game';
import { daysToYears } from '../../engine/requirements';

function AmuletTab() {
  const age = useGameStore(s => daysToYears(s.player.age));

  return (
    <div>
      <p>
        Deep in the ancient ruins, you discovered a peculiar amulet. At its center, a giant eye
        stares back at you, seemingly peering into your very soul. The eye follows your every
        movement, and a faint whisper echoes at the edge of your consciousness.
      </p>

      {age >= 45 && (
        <p>
          You notice strange symbols carved along the amulet's rim. They seem to shift and
          rearrange when you look away. A growing unease settles in your stomach.
        </p>
      )}

      {age >= 65 && (
        <div style={{ marginTop: 16 }}>
          <p>
            You gather your courage and reach out to touch the amulet's eye. A deep warmth
            radiates from it, spreading through your entire body. A voice echoes in your mind:
            <em> "I have been waiting..."</em>
          </p>
          <button className="button" onClick={() => useGameStore.getState().doRebirthOne()}>
            Touch the eye
          </button>
        </div>
      )}

      {age >= 200 && (
        <div style={{ marginTop: 16 }}>
          <p>
            The amulet grows hot against your chest. The eye glows with an inner crimson fire.
            The voice returns, stronger now: <em>"Embrace the darkness. Let the evil flow through you."</em>
            You feel the temptation of limitless power coursing through your veins.
          </p>
          <div>Evil gain multiplier: {getEvilGain(useGameStore.getState()).toFixed(2)}x</div>
          <button className="button" onClick={() => useGameStore.getState().doRebirthTwo()}>
            Embrace evil
          </button>
        </div>
      )}
    </div>
  );
}

export default AmuletTab;
