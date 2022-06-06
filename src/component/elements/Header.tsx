import { useLocationProfitContext, formatCurrency } from '../hooks';
import { HeadWrap } from '../styles/layout';

const Header = () => {
  const { biggerLocationProfit: biggerProfit, order, vehicle } = useLocationProfitContext();
  const biggerProfitLabel = biggerProfit != null ? `${biggerProfit.location.name} (${formatCurrency(biggerProfit.profit)})` : '';

  return (
    <HeadWrap>
      <h1>Beneficios por destino</h1>
      <div>
        <strong>{'Código de pedido:'}</strong> {order.id}<br />
        <strong>{'Vehículo de transporte:'}</strong> {vehicle.name}<br />
        <strong>{'Destino más rentable:'}</strong> {biggerProfitLabel}
      </div>
    </HeadWrap>
  );
};

export default Header;
