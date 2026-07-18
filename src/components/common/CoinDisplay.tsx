import { formatCoins } from '../../engine/economy';

interface CoinDisplayProps { coins: number; }

function CoinDisplay({ coins }: CoinDisplayProps) {
  const tiers = formatCoins(coins);
  return (
    <span className="coin-display">
      {tiers.map((tier, i) =>
        tier.value > 0 || tiers.length === 1 ? (
          <span key={i} style={{ color: tier.color }}>
            {tier.value}{tier.label}{' '}
          </span>
        ) : null
      )}
    </span>
  );
}

export default CoinDisplay;
