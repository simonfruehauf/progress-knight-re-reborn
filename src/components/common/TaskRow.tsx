import ProgressBar from './ProgressBar';
import CoinDisplay from './CoinDisplay';
import { TaskState } from '../../engine/types';
import { getMaxXp } from '../../engine/time';
import { formatNumber } from '../../engine/economy';

interface TaskRowProps {
  name: string;
  task: TaskState;
  baseMaxXp: number;
  income?: number;
  effectDescription?: string;
  xpGain?: number;
  isCurrent: boolean;
  onClick?: () => void;
  skipSkillColumn?: boolean;
}

function TaskRow({ name, task, baseMaxXp, income, effectDescription, xpGain, isCurrent, onClick, skipSkillColumn }: TaskRowProps) {
  const maxXp = getMaxXp(baseMaxXp, task.level);
  return (
    <tr>
      <td>
        <div className={`progress-bar ${isCurrent ? 'current' : ''}`} onClick={onClick} style={{ cursor: 'pointer', width: 200 }}>
          <ProgressBar current={task.xp} max={maxXp} color={isCurrent ? 'orange' : undefined} />
          <span className="name" style={{ position: 'absolute', top: 0, padding: 5, color: 'white' }}>{name}</span>
        </div>
      </td>
      <td>{task.level}</td>
      <td>
        {income !== undefined ? <CoinDisplay coins={income} /> : (effectDescription || '')}
      </td>
      <td>{xpGain !== undefined ? formatNumber(xpGain) : '-'}</td>
      <td>{formatNumber(Math.round(maxXp - task.xp))}</td>
      {skipSkillColumn && <td></td>}
    </tr>
  );
}

export default TaskRow;
