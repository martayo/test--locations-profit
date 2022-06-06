import { Location } from '../types';
import { useLocationProfitContext, formatCurrency } from '../hooks';
import { PercentageBar } from './';

interface Props {
  location: Location;
}

const CostByLocation = ({ location }: Props) => {
  const { locationsProfits } = useLocationProfitContext();
  const locationProfit = locationsProfits.find(locationProfit => locationProfit.location === location);
  if(locationProfit == null) {
    return null;
  }
  const { totalPrice, devaluationCost, transportCost, profit } = locationProfit;

  return (
    <div>
      <div>{`Precio total: ${formatCurrency(totalPrice)}`}</div>
      <div>{`Devaluación: -${formatCurrency(devaluationCost)}`}</div>
      <div>{`Transporte: -${formatCurrency(transportCost)}`}</div>

      { profit != null && <PercentageBar profit={profit} /> }
    </div>
  );
};

export default CostByLocation;
