import { useLocationProfitContext, formatNumber } from '../hooks';

const BiggerLocationProfit = () => {
  const { biggerLocationProfit } = useLocationProfitContext();
  const locationProfit = biggerLocationProfit();

  return <>{ locationProfit != null ? (
    `${locationProfit.location.name} (${formatNumber(locationProfit.units)} ${locationProfit.currency})`
  ) : '' }</>;
};

export default BiggerLocationProfit;
