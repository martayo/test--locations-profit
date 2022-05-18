import { useEffect } from 'react';
import { useLocationProfitContext, useDeliveryCosts, DeliveryCostsConfigProps, formatNumber } from '../hooks';
import { PercentageBar } from '../styles/orderLineCard';

const CostByLocation = (props: DeliveryCostsConfigProps) => {
  const { price: orderLinePrice, location, product } = props;

  const { orderLineProfit } = useDeliveryCosts(props);
  const lineProfit = orderLineProfit();

  const { updateLocationProfit } = useLocationProfitContext();
  useEffect(() => {
    if (lineProfit != null && lineProfit.units > 0) {
      updateLocationProfit({
        location,
        product,
        units: lineProfit?.units,
        currency: lineProfit?.currency,
      });
    }
  }, []);

  return (<>
    { orderLinePrice != null && (
      <>
        <div>{`${formatNumber(orderLinePrice.units)} ${orderLinePrice.currency}/${orderLinePrice.measure}`}</div>

        <PercentageBar size={lineProfit?.percentage != null && lineProfit.percentage >= 0 ? lineProfit.percentage : 0}>
          <span>{`${formatNumber(lineProfit?.units)} ${lineProfit?.currency} de ${lineProfit?.units == null || lineProfit?.units >= 0 ? 'beneficio' : 'pérdida'}`}</span>
          <span>{`${lineProfit?.percentage}%`}</span>
        </PercentageBar>
      </>
    )}
  </>);
};

export default CostByLocation;
