import { Location, OrderLine } from '../types';
import { useLocationProfitContext, formatCurrency } from '../hooks';

interface Props {
  location: Location;
  line: OrderLine;
}

const OrderLineCard = ({ location, line }: Props) => {
  const { orderLinePrices } = useLocationProfitContext();
  const linePrice = orderLinePrices.find(price => price.product === line.product && price.location === location.id);
  if (linePrice == null) {
    return null;
  }

  return (
    <div>
      <div>{`PVP: ${formatCurrency(linePrice.price)}`}</div>
      <span>{`Subtotal: ${formatCurrency(linePrice.linePrice)}`}</span>
    </div>
  );
};

export default OrderLineCard;
