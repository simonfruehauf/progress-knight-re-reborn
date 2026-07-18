import { useGameStore } from '../store/gameStore';
import { getJobIncome, getHappiness } from '../engine/game';
import { getTotalExpense } from '../engine/economy';
import { getMaxXp, getBargainingEffect, getIntimidationEffect, getAllTimeMultipliers } from '../engine/time';
import { calculateTownIncome } from '../engine/town';
import { daysToYears, isSkillUnlocked } from '../engine/requirements';
import { JOB_MAP } from '../engine/data/jobs';
import { SKILL_MAP } from '../engine/data/skills';
import CoinDisplay from './common/CoinDisplay';
import ProgressBar from './common/ProgressBar';

function Sidebar() {
  const state = useGameStore();
  const ageYears = daysToYears(state.player.age);
  const day = Math.floor(state.player.age - ageYears * 365);
  const lifespanYears = daysToYears(state.player.lifespan);

  const jobIncome = state.player.currentJobId ? getJobIncome(state, state.player.currentJobId) : 0;
  const townIncome = calculateTownIncome(state);
  const totalIncome = jobIncome + townIncome;
  const totalExpense = getTotalExpense(state) * getBargainingEffect(state) * getIntimidationEffect(state);
  const net = Math.abs(totalIncome - totalExpense);
  const netSign = totalIncome >= totalExpense ? '+' : '-';

  const currentJobId = state.player.currentJobId;
  const jobState = currentJobId ? state.jobs[currentJobId] : null;
  const jobMaxXp = currentJobId && jobState ? getMaxXp(JOB_MAP[currentJobId].maxXp, jobState.level) : 0;

  const currentSkillId = state.player.currentSkillId;
  const skillState = currentSkillId ? state.skills[currentSkillId] : null;
  const skillMaxXp = currentSkillId && skillState ? getMaxXp(SKILL_MAP[currentSkillId].maxXp, skillState.level) : 0;

  const happiness = getHappiness(state);
  const timeMultiplier = getAllTimeMultipliers(state);

  return (
    <div className="sidebar">
      {state.player.age >= state.player.lifespan && (
        <div className="death-text">You have died. Wait for it...</div>
      )}
      <div>Age: {ageYears}y {day}d</div>
      <div>Lifespan: {lifespanYears}y</div>

      <button className="button" onClick={() => useGameStore.getState().togglePause()}>
        {state.player.paused ? 'Play' : 'Pause'}
      </button>

      <label>
        <input type="checkbox" checked={state.player.autoPromote} onChange={() => useGameStore.getState().toggleAutoPromote()} />
        Auto-promote
      </label>

      <label>
        <input type="checkbox" checked={state.player.autoLearn} onChange={() => useGameStore.getState().toggleAutoLearn()} />
        Auto-learn
      </label>

      <div>Balance (in coins)</div>
      <div style={{ paddingLeft: 16 }}>
        <div>Income: <CoinDisplay coins={totalIncome} /></div>
        <div>Expense: <CoinDisplay coins={totalExpense} /></div>
        <div>Net: {netSign}<CoinDisplay coins={net} /></div>
      </div>

      {currentJobId && jobState && (
        <div>
          <div>Current job:</div>
          <div className="progress-bar current">
            <ProgressBar current={jobState.xp} max={jobMaxXp} color="orange" />
            <span className="name">{JOB_MAP[currentJobId].name} lvl {jobState.level}</span>
          </div>
        </div>
      )}

      {currentSkillId && skillState && (
        <div>
          <div>Current skill:</div>
          <div className="progress-bar current">
            <ProgressBar current={skillState.xp} max={skillMaxXp} color="orange" />
            <span className="name">{SKILL_MAP[currentSkillId].name} lvl {skillState.level}</span>
          </div>
        </div>
      )}

      <div>Happiness: {happiness.toFixed(2)}</div>

      {state.player.evil > 0 && <div>Evil: {state.player.evil.toFixed(1)}</div>}

      {isSkillUnlocked(state, 'timeWarping') && (
        <>
          <div>Time warp: {timeMultiplier.toFixed(2)}x</div>
          <button className="button" onClick={() => useGameStore.getState().toggleTimeWarp()}>
            {state.player.timeWarp ? 'Disable warp' : 'Enable warp'}
          </button>
        </>
      )}
    </div>
  );
}

export default Sidebar;
