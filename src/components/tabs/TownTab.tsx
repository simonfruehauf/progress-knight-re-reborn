import { useGameStore } from '../../store/gameStore';
import CoinDisplay from '../common/CoinDisplay';
import { TOWN_BUILDINGS } from '../../engine/data/townBuildings';
import { calculateTownIncome } from '../../engine/town';

function TownTab() {
  const state = useGameStore();
  const townIncome = calculateTownIncome(state);

  return (
    <div>
      <h3>Town</h3>
      <p>Your town generates income each day. Purchase buildings to increase production and unlock new opportunities.</p>
      <div>
        Town income per day: <CoinDisplay coins={townIncome} />
      </div>
      <div style={{ marginTop: 16 }}>
        {TOWN_BUILDINGS.map(building => {
          const bs = state.town[building.id];
          if (!bs) return null;
          return (
            <div key={building.id} className="tooltip" style={{ display: 'inline-block', margin: 8 }}>
              <button className="item-button" onClick={() => useGameStore.getState().purchaseTownBuilding(building.id)}>
                {building.name} <span className="badge">{bs.count}</span>
              </button>
              <span className="tooltipText">
                Cost: <CoinDisplay coins={bs.costOfNext} /><br />
                Roles: {building.role.join(', ')}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default TownTab;
