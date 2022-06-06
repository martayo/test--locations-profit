import { Product, Order, Price, Location, Vehicle } from './types';
import { LocationProfitProvider, useDeliveryCosts } from './hooks';
import { Header, ProductCard, LocationCard } from './elements';
import { RootCard, BodyWrap } from './styles/layout';
import { Card, Error } from './styles/orderLineCard';

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
}: LocationProfitProps) => {
  const { checkOrderWeight } = useDeliveryCosts();
  const validWeight = checkOrderWeight(order.lines, vehicle.authorizedMaximumWeight);

  return (
    <RootCard>
      <LocationProfitProvider initialValues={{
        products,
        order,
        locations,
        prices,
        vehicle,
      }}>
        <Header />
    
        <BodyWrap>
          <Card>
            <div />
            { products.map(product => <ProductCard key={product.id} product={product} />) }
            <div />
          </Card>

          { validWeight ? (
            <>{ locations.map(location => <LocationCard key={location.id} location={location} />) }</>
          ) : (
            <Card>
              <Error>{`Error: Peso máximo del vehículo superado`}</Error>
            </Card>
          )}
        </BodyWrap>

      </LocationProfitProvider>
    </RootCard>
  );
};

export default LocationProfit;
