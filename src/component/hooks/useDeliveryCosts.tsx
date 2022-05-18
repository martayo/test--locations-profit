import { MeasureProps, CurrencyProps, Product, Location } from '../types';
import { CostPerTravel, CostPerKilometer, DevaluationPerKilometer, Currency } from '../constants';

export type DeliveryCostsConfigProps = {
  product: Product;
  quantity: MeasureProps;
  location: Location;
  price?: MeasureProps & { currency: Currency };
  vehicleWeight: MeasureProps;
};

export type DeliveryCostsFunctionsProps = {
  orderLineTotalPrice: () => MeasureProps & { currency: Currency } | undefined;
  orderLineTotalPriceDevaluation: () => CurrencyProps | undefined;
  travelsFromDistance: () => number;
  orderLineTransportCost: () => CurrencyProps;
  orderLineProfit: () => CurrencyProps & { percentage: number } | undefined;
};

const useDeliveryCosts = (props: DeliveryCostsConfigProps): DeliveryCostsFunctionsProps => {
  const { location, price, quantity, vehicleWeight } = props;

  const orderLineTotalPrice = () => {
    if (price == null || price.measure !== quantity.measure) {
      // TODO: If the measures are different, we should convert them to a common measure
      return undefined;
    }

    return {
      units: price.units * quantity.units,
      currency: price.currency,
      measure: price.measure,
    };
  }

  const orderLineTotalPriceDevaluation = () => {
    const lineTotalPrice = orderLineTotalPrice();
    if (lineTotalPrice == null || lineTotalPrice.currency !== DevaluationPerKilometer.currency) {
      // TODO: If the currencies are different, we should convert them to a common currency
      return undefined;
    }

    return {
      units: lineTotalPrice.units * (location.distance.units * DevaluationPerKilometer.units) / 100,
      currency: DevaluationPerKilometer.currency,
    };
  }

  const travelsFromDistance = () => {
    return Math.ceil(location.distance.units / vehicleWeight.units);
  }

  const orderLineTransportCost = () => {
    const travels = travelsFromDistance();
  
    const vehicleCost = travels * CostPerTravel.units;
    const kilometersCost = location.distance.units * CostPerKilometer.units;
  
    return {
      units: vehicleCost + kilometersCost,
      currency: CostPerTravel.currency,
    };
  }

  const orderLineProfit = () => {
    const lineTotalPrice = orderLineTotalPrice();
    const lineTotalPriceDevaluation = orderLineTotalPriceDevaluation();
    const lineTransportCost = orderLineTransportCost();

    if (lineTotalPrice == null || 
        lineTotalPriceDevaluation == null || 
        lineTotalPrice.currency !== lineTotalPriceDevaluation.currency || 
        lineTotalPrice.currency !== lineTransportCost.currency) {
      // TODO: If the currencies are different, we should convert them to a common currency
      return undefined;
    }

    const lineProfitUnits = lineTotalPrice.units - lineTotalPriceDevaluation.units - lineTransportCost.units;
    return {
      units: lineProfitUnits,
      currency: lineTotalPrice.currency,
      percentage: lineProfitUnits >= 0 ? Math.round(lineProfitUnits * 100 / lineTotalPrice.units) : 0,
    };
  }

  return {
    orderLineTotalPrice,
    orderLineTotalPriceDevaluation,
    travelsFromDistance,
    orderLineTransportCost,
    orderLineProfit,
  };
};

export { useDeliveryCosts };
