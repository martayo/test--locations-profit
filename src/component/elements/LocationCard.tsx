import { Location } from '../types';
import { OrderLineCard, CostByLocation } from '.';
import { useLocationProfitContext, formatMeasure } from '../hooks';
import { Card } from '../styles/orderLineCard';

interface Props {
  location: Location;
}

const LocationsCard = ({ location }: Props) => {
  const { order } = useLocationProfitContext();

  return (
    <Card>
      <div key={location.id}>
        <strong>{location.name}</strong>
        <span>{formatMeasure(location.distance)}</span>
      </div>

      { order.lines.map(line => (
        <OrderLineCard
          key={`${order.id}-${line.product}`}
          location={location}
          line={line}
        />
      )) }

      <CostByLocation location={location} />
    </Card>
  );
};

export default LocationsCard;
