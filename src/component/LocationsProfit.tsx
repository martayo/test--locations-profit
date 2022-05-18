import { Product, Order, Price, Location, Vehicle } from './types';
import { LocationProfitProvider, findProductById } from './hooks';
import { BiggerLocationProfit, OrderLineCard } from './elements';
import { RootCard, HeadWrap, BodyWrap } from './styles/layout';

export type LocationProfitProps = {
  products: Array<Product>;
  order: Order;
  locations: Array<Location>;
  prices: Array<Price>;
  vehicle: Vehicle;
}

const LocationProfit = ({
  products,
  order,
  locations,
  prices,
  vehicle,
}: LocationProfitProps) => (
  <RootCard>
    <LocationProfitProvider initialValues={{
      products,
      order,
      locations,
      prices,
      vehicle,
    }}>

      <HeadWrap>
        <h1>Beneficios por destino</h1>
        <div>
          <strong>{'Código de pedido:'}</strong> {order.id}<br />
          <strong>{'Vehículo de transporte:'}</strong> {vehicle.name}<br />
          <strong>{'Destino más rentable:'}</strong> <BiggerLocationProfit />
        </div>
      </HeadWrap>
  
      <BodyWrap>
        { order.lines.map((line, index) => {
          const product = findProductById(products, line.product);
          if (product == null) {
            return null;
          }

          return (
            <div key={`${order.id}-${index}`}>
              <OrderLineCard
                product={product}
                quantity={line.quantity}
              />
            </div>
          );
        }) }
      </BodyWrap>

    </LocationProfitProvider>
  </RootCard>
);

export default LocationProfit;
