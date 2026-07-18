import { useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { daysToYears } from '../engine/requirements';
import JobsTab from './tabs/JobsTab';
import SkillsTab from './tabs/SkillsTab';
import ShopTab from './tabs/ShopTab';
import TownTab from './tabs/TownTab';
import AmuletTab from './tabs/AmuletTab';
import AchievementsTab from './tabs/AchievementsTab';
import SettingsTab from './tabs/SettingsTab';

function GameTabs() {
  const [activeTab, setActiveTab] = useState('jobs');
  const age = useGameStore(s => daysToYears(s.player.age));
  const coins = useGameStore(s => s.player.coins);

  const TABS = [
    { id: 'jobs', label: 'Jobs', component: JobsTab, show: true },
    { id: 'skills', label: 'Skills', component: SkillsTab, show: true },
    { id: 'shop', label: 'Shop', component: ShopTab, show: age >= 25 || coins >= 1500 },
    { id: 'town', label: 'Town', component: TownTab, show: true },
    { id: 'rebirth', label: 'Amulet', component: AmuletTab, show: age >= 25 },
    { id: 'achievements', label: 'Achievements', component: AchievementsTab, show: true },
    { id: 'settings', label: 'Settings', component: SettingsTab, show: true },
  ] as const;

  const visibleTabs = TABS.filter(t => t.show);
  const ActiveComponent = visibleTabs.find(t => t.id === activeTab)?.component || JobsTab;

  return (
    <div className="tab-container">
      <div className="tab-bar panel" style={{ height: 40 }}>
        {visibleTabs.map(tab => (
          <button key={tab.id} className={`tab-button ${activeTab === tab.id ? 'active' : ''}`} onClick={() => setActiveTab(tab.id)}>
            {tab.label}
          </button>
        ))}
      </div>
      <div className="tab-content panel">
        <ActiveComponent />
      </div>
    </div>
  );
}

export default GameTabs;
