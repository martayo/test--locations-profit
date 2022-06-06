import { CurrencyProps } from '../types';
import { PercentageBar } from '../styles/orderLineCard';
import { formatCurrency } from '../hooks';

interface Props {
  profit: CurrencyProps & { percentage: number };
}

const PercentageBarComponent = ({ profit }: Props) => (
  <PercentageBar size={profit.percentage}>
    <span>{`Beneficio: ${formatCurrency(profit)}`}</span>
    <span>{`${profit.percentage}%`}</span>
  </PercentageBar>
);

export default PercentageBarComponent;
