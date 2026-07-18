import { useGameStore } from '../../store/gameStore';
import CoinDisplay from '../common/CoinDisplay';
import { ITEMS } from '../../engine/data/items';
import { isItemUnlocked } from '../../engine/requirements';

const PROPERTIES = ITEMS.filter(i => i.category === 'Property');
const MISC = ITEMS.filter(i => i.category === 'Misc');

function ShopTab() {
  const state = useGameStore();

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
          {PROPERTIES.filter(i => isItemUnlocked(state, i.id)).map(item => {
            const isActive = state.player.currentPropertyId === item.id;
            return (
              <tr key={item.id}>
                <td>
                  <button className="item-button" onClick={() => useGameStore.getState().setProperty(item.id)}>
                    {item.name}
                  </button>
                </td>
                <td>
                  <span style={{ color: isActive ? 'green' : 'gray', fontSize: 24 }}>●</span>
                </td>
                <td>{item.description || `Happiness x${item.effect}`}</td>
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
          {MISC.filter(i => isItemUnlocked(state, i.id)).map(item => {
            const isActive = state.player.currentMiscIds.includes(item.id);
            return (
              <tr key={item.id}>
                <td>
                  <button className="item-button" onClick={() => useGameStore.getState().toggleMisc(item.id)}>
                    {item.name}
                  </button>
                </td>
                <td>
                  <span style={{ color: isActive ? 'green' : 'gray', fontSize: 24 }}>●</span>
                </td>
                <td>{item.description}</td>
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
