interface ProgressBarProps {
  current: number;
  max: number;
  color?: string;
  className?: string;
}

function ProgressBar({ current, max, color = 'rgb(46, 148, 231)', className }: ProgressBarProps) {
  const pct = max > 0 ? Math.min(100, (current / max) * 100) : 0;
  return (
    <div className={`progress-fill ${className || ''}`} style={{ width: pct > 0 ? `${pct}%` : '0%', backgroundColor: color }} />
  );
}

export default ProgressBar;
