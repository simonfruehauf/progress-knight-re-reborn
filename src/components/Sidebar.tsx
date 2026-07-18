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
        <div>
          <div className="death-text">Age has caught up to you</div>
          <div className="death-subtitle">Your age has met your lifespan, use the amulet to rebirth before you pass away</div>
        </div>
      )}
      <div>Age: {ageYears}y {day}d</div>
      <div>Lifespan: {lifespanYears}y</div>

      <button className="button" onClick={() => useGameStore.getState().togglePause()}>
        {state.player.paused ? 'Play' : 'Pause'}
      </button>

      {ageYears >= 20 && (
        <label>
          <input type="checkbox" checked={state.player.autoPromote} onChange={() => useGameStore.getState().toggleAutoPromote()} />
          Auto-promote
        </label>
      )}

      {ageYears >= 20 && (
        <label>
          <input type="checkbox" checked={state.player.autoLearn} onChange={() => useGameStore.getState().toggleAutoLearn()} />
          Auto-learn
        </label>
      )}

      <div className="coin-balance-label">Balance (in coins)</div>

      <ul className="balance-list">
        <li><span className="net-color">Net/day: </span>{netSign}<CoinDisplay coins={net} /></li>
        <li><span className="income-color">Income/day: </span><CoinDisplay coins={totalIncome} /></li>
        <li><span className="expense-color">Expense/day: </span><CoinDisplay coins={totalExpense} /></li>
      </ul>

      {currentJobId && jobState && (
        <div>
          <div className="progress-bar current" style={{ width: 230 }}>
            <ProgressBar current={jobState.xp} max={jobMaxXp} color="orange" />
            <span className="name">{JOB_MAP[currentJobId].name} lvl {jobState.level}</span>
          </div>
          <div className="current-job-label">Current job</div>
        </div>
      )}

      {currentSkillId && skillState && (
        <div>
          <div className="progress-bar current" style={{ width: 230 }}>
            <ProgressBar current={skillState.xp} max={skillMaxXp} color="orange" />
            <span className="name">{SKILL_MAP[currentSkillId].name} lvl {skillState.level}</span>
          </div>
          <div className="current-skill-label">Current skill</div>
        </div>
      )}

      <div><span className="happiness-label">Happiness: </span>{happiness.toFixed(2)}
      <span className="current-skill-label"><br></br>Affects all xp gain</span>
      </div>

      {state.player.evil > 0 && <div><span className="evil-label">Evil: </span>{state.player.evil.toFixed(1)}</div>}

      {isSkillUnlocked(state, 'timeWarping') && (
        <div>
          <div><span className="timewarp-label">Time warping: </span>{timeMultiplier.toFixed(2)}x</div>
          <button className="button" onClick={() => useGameStore.getState().toggleTimeWarp()} style={{ marginTop: 5, width: 150 }}>
            {state.player.timeWarp ? 'Disable warp' : 'Enable warp'}
          </button>
        </div>
      )}
    </div>
  );
}

export default Sidebar;
