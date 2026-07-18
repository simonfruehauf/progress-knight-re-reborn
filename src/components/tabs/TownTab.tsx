import { useGameStore } from '../../store/gameStore';
import CoinDisplay from '../common/CoinDisplay';
import { TOWN_BUILDINGS } from '../../engine/data/townBuildings';
import { TownBuildingDef } from '../../engine/types';
import { calculateTownIncome } from '../../engine/town';

function TownTab() {
  const state = useGameStore();
  const townIncome = calculateTownIncome(state);

  const getEffectText = (building: TownBuildingDef) => {
    if (building.income) return `Additional daily income: ${building.income} coppers`;
    if (building.incomeMultiplier) return `Additional ${building.incomeMultiplier * 100}% ${building.targets?.join(', ')} income (compounding)`;
    return 'None';
  };

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
          const isSecret = building.id === 'secret';
          return (
            <div key={building.id} className="tooltip" style={{ display: 'inline-block', margin: 8 }}>
              {isSecret ? (
                <button className="item-button" style={{ opacity: 0.5, cursor: 'default' }} disabled>
                  {building.name} <span className="badge">{bs.count}</span>
                </button>
              ) : (
                <button className="item-button" onClick={() => useGameStore.getState().purchaseTownBuilding(building.id)}>
                  {building.name} <span className="badge">{bs.count}</span>
                </button>
              )}
              <span className="tooltipText">
                {building.description}<br />
                Cost: <CoinDisplay coins={bs.costOfNext} /><br />
                Cost growth: {(building.costGrowthFactor * 100 - 100).toFixed(1)}%<br />
                Effect: {getEffectText(building)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default TownTab;
