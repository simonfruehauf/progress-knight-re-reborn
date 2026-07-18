import { useGameStore } from '../../store/gameStore';
import TaskRow from '../common/TaskRow';
import { SKILLS } from '../../engine/data/skills';
import { SKILL_CATEGORIES } from '../../engine/data/categories';
import { HEADER_ROW_COLORS } from '../../engine/data/headerRowColors';
import { getSkillXpGain } from '../../engine/game';
import { isSkillUnlocked, getRequirementDescription, anyRequirementMet, checkRequirement } from '../../engine/requirements';
import { SKILL_REQUIREMENTS } from '../../engine/data/requirements';
import { SKILL_TOOLTIPS } from '../../engine/data/tooltips';

function SkillsTab() {
  const state = useGameStore();

  return (
    <table className="w3-table w3-bordered">
      <tbody>
        {SKILL_CATEGORIES.flatMap(cat => {
          const unlocked = SKILLS.filter(s => s.category === cat && isSkillUnlocked(state, s.id));
          const locked = SKILLS.filter(s => s.category === cat && !isSkillUnlocked(state, s.id));
          const nextLocked = locked[0];
          if (unlocked.length === 0 && (!nextLocked || !anyRequirementMet(state, SKILL_REQUIREMENTS[nextLocked.id] ?? []))) return [];
          return [
          <tr key={`hdr-${cat}`} style={{ backgroundColor: HEADER_ROW_COLORS[cat], color: 'white', fontWeight: 'bold' }}>
            <th style={{ width: 200, textAlign: 'left' }}>{cat}</th>
            <th style={{ width: 60, textAlign: 'left' }}>Level</th>
            <th style={{ width: 100, textAlign: 'left' }}>Effect</th>
            <th style={{ width: 80, textAlign: 'left' }}>Xp/day</th>
            <th style={{ width: 80, textAlign: 'left' }}>Xp left</th>
            <th style={{ width: 80, textAlign: 'left' }}>Max level</th>
            <th style={{ width: 50, textAlign: 'left' }}>Skip</th>
          </tr>,
          ...unlocked.map(skillDef => {
            const task = state.skills[skillDef.id];
            if (!task) return null;
            const effectDescription = `x${(1 + task.level * skillDef.effect).toFixed(2)} ${skillDef.description}`;
            return (
              <TaskRow
                key={skillDef.id}
                name={skillDef.name}
                task={task}
                baseMaxXp={skillDef.maxXp}
                effectDescription={effectDescription}
                xpGain={getSkillXpGain(state, skillDef.id)}
                isCurrent={state.player.currentSkillId === skillDef.id}
                onClick={() => useGameStore.getState().setSkill(skillDef.id)}
                tooltipText={SKILL_TOOLTIPS[skillDef.id]}
                skipChecked={state.player.skippedSkills.includes(skillDef.id)}
                onToggleSkip={() => useGameStore.getState().toggleSkipSkill(skillDef.id)}
              />
            );
          }),
          nextLocked && (() => {
            const unmetReqs = (SKILL_REQUIREMENTS[nextLocked.id] ?? []).filter(r => !checkRequirement(state, r));
            if (unmetReqs.length === 0) return null;
            return (
              <tr key={`req-${nextLocked.id}`} className="required-row">
                <td colSpan={7}>
                  Required: {unmetReqs.map(r => getRequirementDescription(state, r)).join(', ')}
                </td>
              </tr>
            );
          })(),
        ]})}
      </tbody>
    </table>
  );
}

export default SkillsTab;
