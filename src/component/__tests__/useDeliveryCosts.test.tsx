import { renderHook } from '@testing-library/react';
import { useDeliveryCosts } from '../hooks';
import { DevaluationPerKilometer, CostPerKilometer, CostPerTravel } from '../constants';

describe('useDeliveryCosts', () => {
  const setup = () => {
    const location = { id: 123, name: 'Lugo', distance: { units: 150, measure: 'km' } };
    const args = [
      {
        location,
        product: { id: 'product1-id', name: 'Galletas' },
        price: { units: 5, currency: '€', measure: 'kg' },
        quantity: { units: 200, measure: 'kg' },
      },
      {
        location,
        product: { id: 'product2-id', name: 'Limones' },
        price: { units: 7.50, currency: '€', measure: 'kg' },
        quantity: { units: 20, measure: 'kg' },
      }
    ];

    const renderHookCosts = () => renderHook(() => useDeliveryCosts()).result.current;
    return {
      location,
      args,
      renderHookCosts,
    };
  };

  it('getOrderLinePrice > calc price of the order line', () => {
    const { args, renderHookCosts } = setup();
    const { getOrderLinePrice } = renderHookCosts();
    const linePrice = getOrderLinePrice(args[0].price, args[0].quantity);

    expect(linePrice?.units).toBe(args[0].price.units * args[0].quantity.units);
    expect(linePrice?.currency).toBe(args[0].price.currency);
  });

  it('getOrderPrice > calc total price of the order', () => {
    const { location, args, renderHookCosts } = setup();
    const { getOrderLinePrice, getOrderPrice } = renderHookCosts();

    const defaultPrice = { units: 0, currency: '€' };
    const linePrices = [
      {
        location: location.id,
        product: args[0].product.id,
        linePrice: getOrderLinePrice(args[0].price, args[0].quantity) ?? defaultPrice,
      },
      {
        location: location.id,
        product: args[1].product.id,
        linePrice: getOrderLinePrice(args[1].price, args[1].quantity) ?? defaultPrice,
      }
    ];

    const totalPrice = getOrderPrice(location, linePrices);

    expect(totalPrice?.units).toBe(
      args[0].price.units * args[0].quantity.units + args[1].price.units * args[1].quantity.units
    );
    expect(totalPrice?.currency).toBe(args[0].price.currency);
  });

  it('checkOrderWeight > check if the vehicle can support the weight of the order', () => {
    const { args, renderHookCosts } = setup();
    const { checkOrderWeight } = renderHookCosts();

    const orderLines = [
      { product: args[0].product.id, quantity: args[0].quantity },
      { product: args[1].product.id, quantity: args[1].quantity },
    ];

    expect(
      checkOrderWeight(orderLines, { units: 500, measure: 'kg' })
    ).toBe(true);

    expect(
      checkOrderWeight(orderLines, { units: 100, measure: 'kg' })
    ).toBe(false);
  });

  it('getDevaluationCost > calc the price devaluation when we arrive to the location', () => {
    const { location, args, renderHookCosts } = setup();
    const { getDevaluationCost } = renderHookCosts();
    const devaluationCost = getDevaluationCost(location, args[0].price);

    expect(devaluationCost?.units).toBe(
      (args[0].price?.units ?? 0) * (location.distance.units * DevaluationPerKilometer.units) / 100
    );
    expect(devaluationCost?.currency).toBe(DevaluationPerKilometer.currency);
  });

  it('getTransportCost > calc transport costs', () => {
    const { location, renderHookCosts } = setup();
    const { getTransportCost } = renderHookCosts();
    const transportCost = getTransportCost(location);

    const vehicleCost = CostPerTravel.units;
    const kilometersCost = location.distance.units * CostPerKilometer.units;

    expect(transportCost.units).toBe(vehicleCost + kilometersCost);
    expect(transportCost.currency).toBe(CostPerTravel.currency);
  });

  it('getOrderProfit > calc profit', () => {
    const { location, args, renderHookCosts } = setup();
    const { getOrderLinePrice, getOrderPrice, getTransportCost, getDevaluationCost, getOrderProfit } = renderHookCosts();
    
    const transportCost = getTransportCost(location);
    const devaluationCost = getDevaluationCost(location, args[0].price);

    const defaultPrice = { units: 0, currency: '€' };
    const linePrices = [
      {
        location: location.id,
        product: args[0].product.id,
        linePrice: getOrderLinePrice(args[0].price, args[0].quantity) ?? defaultPrice,
      },
      {
        location: location.id,
        product: args[1].product.id,
        linePrice: getOrderLinePrice(args[1].price, args[1].quantity) ?? defaultPrice,
      }
    ];
    const totalPrice = getOrderPrice(location, linePrices);

    const lineProfit = getOrderProfit({
      price: totalPrice,
      transport: transportCost,
      devaluation: devaluationCost,
    });

    const lineProfitUnits = (totalPrice?.units ?? 0) - (devaluationCost?.units ?? 0) - transportCost.units;
    expect(lineProfit?.units).toBe(lineProfitUnits);
    expect(lineProfit?.currency).toBe(totalPrice?.currency);
    expect(lineProfit?.percentage).toBe(Math.round(lineProfitUnits * 100 / (totalPrice?.units ?? 0)));
  });
});
