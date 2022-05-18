import { MeasureProps, Product } from '../types';
import { ProductCard, OrderLineDetails, LocationDetails } from '../styles/orderLineCard';
import { CostByLocation } from '.';
import { useLocationProfitContext, findPriceByProductAndLocation } from '../hooks';

interface Props {
  product: Product;
  quantity: MeasureProps;
}

const OrderLineCard = ({ product, quantity }: Props) => {
  const { locations, prices, vehicle } = useLocationProfitContext();

  return (
    <ProductCard>
      { product.image != null && <img src={product.image} alt={product.name} /> }
  
      <OrderLineDetails>
        <h2>{product.name}</h2>
        <span>{`${quantity.units} ${quantity.measure}`}</span>
      </OrderLineDetails>
  
      { prices != null && vehicle != null && locations.map(location => (
        <LocationDetails key={location.id}>
          <strong>{location.name}</strong>
          <CostByLocation
            product={product}
            price={findPriceByProductAndLocation(prices, product.id, location.id)?.price}
            location={location}
            quantity={quantity}
            vehicleWeight={vehicle.authorizedMaximumWeight}
          />
        </LocationDetails>
      )) }
    </ProductCard>
  );
};

export default OrderLineCard;
