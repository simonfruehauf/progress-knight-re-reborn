import { useGameStore } from '../../store/gameStore';
import TaskRow from '../common/TaskRow';
import { JOBS } from '../../engine/data/jobs';
import { JOB_CATEGORIES } from '../../engine/data/categories';
import { HEADER_ROW_COLORS } from '../../engine/data/headerRowColors';
import { getJobIncome, getJobXpGain } from '../../engine/game';
import { isJobUnlocked, getRequirementDescription, anyRequirementMet, checkRequirement } from '../../engine/requirements';
import { JOB_REQUIREMENTS } from '../../engine/data/requirements';
import { JOB_TOOLTIPS } from '../../engine/data/tooltips';

function JobsTab() {
  const jobs = useGameStore(s => s.jobs);
  const currentJobId = useGameStore(s => s.player.currentJobId);

  return (
    <table className="w3-table w3-bordered">
      <tbody>
        {JOB_CATEGORIES.flatMap(cat => {
          const unlocked = JOBS.filter(j => j.category === cat && isJobUnlocked(useGameStore.getState(), j.id));
          const locked = JOBS.filter(j => j.category === cat && !isJobUnlocked(useGameStore.getState(), j.id));
          const nextLocked = locked[0];
          if (unlocked.length === 0 && (!nextLocked || !anyRequirementMet(useGameStore.getState(), JOB_REQUIREMENTS[nextLocked.id] ?? []))) return [];
          return [
          <tr key={`hdr-${cat}`} style={{ backgroundColor: HEADER_ROW_COLORS[cat], color: 'white', fontWeight: 'bold' }}>
            <th style={{ width: 200, textAlign: 'left' }}>{cat}</th>
            <th style={{ width: 60, textAlign: 'left' }}>Level</th>
            <th style={{ width: 100, textAlign: 'left' }}>Income/day</th>
            <th style={{ width: 80, textAlign: 'left' }}>Xp/day</th>
            <th style={{ width: 80, textAlign: 'left' }}>Xp left</th>
            <th style={{ width: 80, textAlign: 'left' }}>Max level</th>
          </tr>,
          ...unlocked.map(jobDef => {
            const task = jobs[jobDef.id];
            if (!task) return null;
            return (
              <TaskRow
                key={jobDef.id}
                name={jobDef.name}
                task={task}
                baseMaxXp={jobDef.maxXp}
                income={getJobIncome(useGameStore.getState(), jobDef.id)}
                xpGain={getJobXpGain(useGameStore.getState(), jobDef.id)}
                isCurrent={currentJobId === jobDef.id}
                onClick={() => useGameStore.getState().setJob(jobDef.id)}
                tooltipText={JOB_TOOLTIPS[jobDef.id]}
              />
            );
          }),
          nextLocked && (() => {
            const unmetReqs = (JOB_REQUIREMENTS[nextLocked.id] ?? []).filter(r => !checkRequirement(useGameStore.getState(), r));
            if (unmetReqs.length === 0) return null;
            return (
              <tr key={`req-${nextLocked.id}`} className="required-row">
                <td colSpan={6}>
                  Required: {unmetReqs.map(r => getRequirementDescription(useGameStore.getState(), r)).join(', ')}
                </td>
              </tr>
            );
          })(),
        ]})}
      </tbody>
    </table>
  );
}

export default JobsTab;
