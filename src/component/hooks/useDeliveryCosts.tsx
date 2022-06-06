import { useCallback } from 'react';
import { IdType, CurrencyProps, MeasureProps, Location, OrderLine } from '../types';
import { ProfitProps } from './';
import { CostPerTravel, CostPerKilometer, DevaluationPerKilometer, Currency } from '../constants';

interface DeliveryCostProps {
  location: Location;
  prices: Array<TotalPriceProps>;
}

interface TotalPriceProps {
  location: IdType;
  product: IdType;
  linePrice: CurrencyProps;
}
interface ProfitFunctionsProps {
  price?: CurrencyProps;
  transport: CurrencyProps;
  devaluation?: CurrencyProps;
}

interface DeliveryCostFunctionsProps {
  getOrderLinePrice: (price: MeasureProps & { currency: Currency }, quantity: MeasureProps) => CurrencyProps | undefined;
  getOrderPrice: (location: Location, prices: Array<TotalPriceProps>) => CurrencyProps | undefined;
  checkOrderWeight: (orderLines: Array<OrderLine>, vehicleWeight: MeasureProps) => boolean;
  getDevaluationCost: (location: Location, price?: CurrencyProps) => CurrencyProps | undefined;
  getTransportCost: (location: Location) => CurrencyProps;
  getOrderProfit: (props: ProfitFunctionsProps) => CurrencyProps & { percentage: number } | undefined;
  getDeliveryCosts: (props: DeliveryCostProps) => ProfitProps | undefined;
};

const useDeliveryCosts = (): DeliveryCostFunctionsProps => {

  const getOrderLinePrice = (price: MeasureProps & { currency: Currency }, quantity: MeasureProps) => {
    if (price == null || price.measure !== quantity.measure) {
      // TODO: If the measures are different, we should convert them to a common measure
      return undefined;
    }

    return {
      units: price.units * quantity.units,
      currency: price.currency,
    };
  }

  const getOrderPrice = useCallback((location: Location, prices: Array<TotalPriceProps>) => {
    const pricesLocation = prices.filter(price => price.location === location.id);
    if (pricesLocation == null) {
      return undefined;
    }

    const totalUnits = pricesLocation.reduce((total, price) => total + price.linePrice.units, 0);
    return {
      units: totalUnits,
      currency: prices[0].linePrice.currency,
    };
  }, []);

  const checkOrderWeight = useCallback((orderLines: Array<OrderLine>, vehicleWeight: MeasureProps) => {
    const orderWeight = orderLines.reduce((total, line) => total + line.quantity.units, 0);

    return vehicleWeight.units >= orderWeight;
  }, []);

  const getDevaluationCost = useCallback((location: Location, price?: CurrencyProps) => {
    if (price == null || price.currency !== DevaluationPerKilometer.currency) {
      // TODO: If the currencies are different, we should convert them to a common currency
      return undefined;
    }

    return {
      units: price.units * (location.distance.units * DevaluationPerKilometer.units) / 100,
      currency: DevaluationPerKilometer.currency,
    };
  }, []);
  
  const getTransportCost = useCallback((location: Location) => {
    const vehicleCost = CostPerTravel.units;
    const kilometersCost = location.distance.units * CostPerKilometer.units;
  
    return {
      units: vehicleCost + kilometersCost,
      currency: CostPerTravel.currency,
    };
  }, []);

  const getOrderProfit = useCallback(({ price, transport, devaluation }: ProfitFunctionsProps) => {
    if (devaluation == null || price == null || 
        price.currency !== devaluation.currency || price.currency !== transport.currency) {
      // TODO: If the currencies are different, we should convert them to a common currency
      return undefined;
    }

    const profit = price.units - devaluation.units - transport.units;
    return {
      units: profit,
      currency: price.currency,
      percentage: profit >= 0 ? Math.round(profit * 100 / price.units) : 0,
    };
  }, []);

  const getDeliveryCosts = useCallback(({ location, prices }: DeliveryCostProps) => {
    const totalPrice = getOrderPrice(location, prices);
    const transportCost = getTransportCost(location);
    const devaluationCost = getDevaluationCost(location, totalPrice);
    const profit = getOrderProfit({
      price: totalPrice,
      transport: transportCost,
      devaluation: devaluationCost
    });

    if (profit == null) {
      return undefined;
    }
    return {
      location,
      totalPrice,
      devaluationCost,
      transportCost,
      profit,
    };
  }, [getDevaluationCost, getOrderPrice, getOrderProfit, getTransportCost]);

  return {
    getOrderLinePrice,
    getOrderPrice,
    checkOrderWeight,
    getDevaluationCost,
    getTransportCost,
    getOrderProfit,
    getDeliveryCosts,
  };
};

export { useDeliveryCosts };
