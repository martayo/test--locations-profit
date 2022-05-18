import { ReactNode } from 'react';
import { render, screen } from '@testing-library/react';

import { LocationProfitProvider, useDeliveryCosts } from '../hooks';
import { CostByLocation } from '../elements';
import { DevaluationPerKilometer, CostPerKilometer, CostPerTravel } from '../constants';

describe('useDeliveryCosts', () => {
  const setup = () => {
    const locations = [
      { id: 123, name: 'Lugo', distance: { units: 150, measure: 'km' } },
      { id: 456, name: 'Asturias', distance: { units: 300, measure: 'km' } },
    ];
    const args = {
      product: { id: 'product-id', name: 'Galletas' },
      location: locations[0],
      price: { units: 5, currency: '€', measure: 'kg' },
      quantity: { units: 200, measure: 'kg' },
      vehicleWeight: { units: 100, measure: 'kg' },
    };

    const wrapper = ({ children }: { children: ReactNode }) => (
      <LocationProfitProvider initialValues={{ locations }}>
        {children}
      </LocationProfitProvider>
    );
    const renderComponent = () => render(<CostByLocation {...args} />, { wrapper });

    return {
      args,
      renderComponent,
    };
  };

  it('orderLineTotalPrice > calc total price of the order line', () => {
    const { args, renderComponent } = setup();
    renderComponent();

    const { orderLineTotalPrice } = useDeliveryCosts(args);
    const lineTotalPrice = orderLineTotalPrice();

    expect(lineTotalPrice?.units).toBe(args.price.units * args.quantity.units);
    expect(lineTotalPrice?.currency).toBe(args.price.currency);
    expect(lineTotalPrice?.measure).toBe(args.price.measure);
  });

  it('orderLineTotalPriceDevaluation > calc the price devaluation when we arrive to the location', () => {
    const { args, renderComponent } = setup();
    renderComponent();

    const { orderLineTotalPriceDevaluation, orderLineTotalPrice } = useDeliveryCosts(args);
    const lineTotalPriceDevaluation = orderLineTotalPriceDevaluation();
    const lineTotalPrice = orderLineTotalPrice();

    expect(lineTotalPriceDevaluation?.units).toBe(
      (lineTotalPrice?.units ?? 0) * (args.location.distance.units * DevaluationPerKilometer.units) / 100
    );
    expect(lineTotalPriceDevaluation?.currency).toBe(DevaluationPerKilometer.currency);
  });

  it('travelsFromDistance > calc number of travels to transport all the quantity', () => {
    const { args, renderComponent } = setup();
    renderComponent();

    const { travelsFromDistance } = useDeliveryCosts(args);
    const travels = travelsFromDistance();

    expect(travels).toBe(Math.ceil(args.location.distance.units / args.vehicleWeight.units));
  });

  it('orderLineTransportCost > calc transport costs', () => {
    const { args, renderComponent } = setup();
    renderComponent();

    const { orderLineTransportCost, travelsFromDistance } = useDeliveryCosts(args);
    const lineTransportCost = orderLineTransportCost();
    
    const vehicleCost = travelsFromDistance() * CostPerTravel.units;
    const kilometersCost = args.location.distance.units * CostPerKilometer.units;

    expect(lineTransportCost.units).toBe(vehicleCost + kilometersCost);
    expect(lineTransportCost.currency).toBe(CostPerTravel.currency);
  });

  it('orderLineProfit > calc profit', () => {
    const { args, renderComponent } = setup();
    renderComponent();

    const { orderLineProfit, orderLineTotalPrice, orderLineTotalPriceDevaluation, orderLineTransportCost } = useDeliveryCosts(args);
    const lineProfit = orderLineProfit();

    const totalPrice = orderLineTotalPrice();
    const priceDevaluation = orderLineTotalPriceDevaluation();
    const transportCost = orderLineTransportCost();
    const lineProfitUnits = (totalPrice?.units ?? 0) - (priceDevaluation?.units ?? 0) - transportCost.units;

    expect(lineProfit?.units).toBe(lineProfitUnits);
    expect(lineProfit?.currency).toBe(totalPrice?.currency);
    expect(lineProfit?.percentage).toBe(Math.round(lineProfitUnits * 100 / (totalPrice?.units ?? 0)));
  });
});
