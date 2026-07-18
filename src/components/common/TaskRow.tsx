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
  tooltipText?: string;
  skipChecked?: boolean;
  onToggleSkip?: () => void;
}

function TaskRow({ name, task, baseMaxXp, income, effectDescription, xpGain, isCurrent, onClick, tooltipText, skipChecked, onToggleSkip }: TaskRowProps) {
  const maxXp = getMaxXp(baseMaxXp, task.level);
  return (
    <tr>
      <td>
        {tooltipText ? (
          <div className="tooltip">
            <div className={`progress-bar tooltip ${isCurrent ? 'current' : ''}`} onClick={onClick} style={{ cursor: 'pointer', width: 200 }}>
              <ProgressBar current={task.xp} max={maxXp} color={isCurrent ? 'orange' : undefined} />
              <span className="name" style={{ position: 'absolute', top: 0, padding: 5, color: 'white' }}>{name}</span>
            </div>
            <span className="tooltipText">{tooltipText}</span>
          </div>
        ) : (
          <div className={`progress-bar ${isCurrent ? 'current' : ''}`} onClick={onClick} style={{ cursor: 'pointer', width: 200 }}>
            <ProgressBar current={task.xp} max={maxXp} color={isCurrent ? 'orange' : undefined} />
            <span className="name" style={{ position: 'absolute', top: 0, padding: 5, color: 'white' }}>{name}</span>
          </div>
        )}
      </td>
      <td>{task.level}</td>
      <td>
        {income !== undefined ? <CoinDisplay coins={income} /> : (effectDescription || '')}
      </td>
      <td>{xpGain !== undefined ? formatNumber(xpGain) : '-'}</td>
      <td>{formatNumber(Math.round(maxXp - task.xp))}</td>
      <td>{task.maxLevel}</td>
      {onToggleSkip && (
        <td><input type="checkbox" checked={!!skipChecked} onChange={onToggleSkip} /></td>
      )}
    </tr>
  );
}

export default TaskRow;
