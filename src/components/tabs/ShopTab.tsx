import { useGameStore } from '../../store/gameStore';
import CoinDisplay from '../common/CoinDisplay';
import { ITEMS } from '../../engine/data/items';
import { isItemUnlocked } from '../../engine/requirements';
import { ITEM_TOOLTIPS } from '../../engine/data/tooltips';

const PROPERTIES = ITEMS.filter(i => i.category === 'Property');
const MISC = ITEMS.filter(i => i.category === 'Misc');

function ShopTab() {
  const currentPropertyId = useGameStore(s => s.player.currentPropertyId);
  const currentMiscIds = useGameStore(s => s.player.currentMiscIds);

  return (
    <div>
      <h3>Properties</h3>
      <table className="w3-table w3-bordered">
        <thead>
          <tr>
            <th>Property</th>
            <th>Active</th>
            <th>Effect</th>
            <th>Expense/day</th>
          </tr>
        </thead>
        <tbody>
          {PROPERTIES.filter(i => isItemUnlocked(useGameStore.getState(), i.id)).map(item => {
            const isActive = currentPropertyId === item.id;
            return (
              <tr key={item.id}>
                <td>
                  <div className="tooltip" style={{ display: 'inline-block' }}>
                    <button className="item-button" onClick={() => useGameStore.getState().setProperty(item.id)}>
                      {item.name}
                    </button>
                    <span className="tooltipText">{ITEM_TOOLTIPS[item.id]}</span>
                  </div>
                </td>
                <td>
                  <span style={{ color: isActive ? 'green' : 'gray', fontSize: 24 }}>●</span>
                </td>
                <td>x{item.effect.toFixed(2)} {item.description || 'Happiness'}</td>
                <td><CoinDisplay coins={item.expense} /></td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <h3>Misc</h3>
      <table className="w3-table w3-bordered">
        <thead>
          <tr>
            <th>Misc</th>
            <th>Active</th>
            <th>Effect</th>
            <th>Expense/day</th>
          </tr>
        </thead>
        <tbody>
          {MISC.filter(i => isItemUnlocked(useGameStore.getState(), i.id)).map(item => {
            const isActive = currentMiscIds.includes(item.id);
            return (
              <tr key={item.id}>
                <td>
                  <div className="tooltip" style={{ display: 'inline-block' }}>
                    <button className="item-button" onClick={() => useGameStore.getState().toggleMisc(item.id)}>
                      {item.name}
                    </button>
                    <span className="tooltipText">{ITEM_TOOLTIPS[item.id]}</span>
                  </div>
                </td>
                <td>
                  <span style={{ color: isActive ? 'green' : 'gray', fontSize: 24 }}>●</span>
                </td>
                <td>x{item.effect.toFixed(2)} {item.description}</td>
                <td><CoinDisplay coins={item.expense} /></td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default ShopTab;
