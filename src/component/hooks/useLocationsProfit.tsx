import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';

import { IdType, Product, Order, Price, Location, Vehicle, CurrencyProps, OrderLine } from '../types';
import { useDeliveryCosts } from './';

interface InitialValuesProps {
  products: Array<Product>;
  order: Order;
  locations: Array<Location>;
  prices: Array<Price>;
  vehicle: Vehicle;
}

interface OrderLinePrice {
  product: IdType;
  location: IdType;
  price: CurrencyProps;
  linePrice: CurrencyProps;
}
export type ProfitProps = {
  location: Location;
  totalPrice: CurrencyProps | undefined;
  devaluationCost: CurrencyProps | undefined;
  transportCost: CurrencyProps;
  profit: CurrencyProps & { percentage: number } | undefined;
}

interface ProviderProps {
  children: ReactNode;
  initialValues: InitialValuesProps;
}
interface ContextProps extends InitialValuesProps {
  orderLinePrices: Array<OrderLinePrice>;
  locationsProfits: Array<ProfitProps>;
  biggerLocationProfit: ProfitProps | undefined;
}

const LocationProfitContext = createContext<ContextProps | undefined>(undefined);

const LocationProfitProvider = ({ children, initialValues }: ProviderProps) => {
  const { getOrderLinePrice, checkOrderWeight, getDeliveryCosts } = useDeliveryCosts();

  const [orderLinePrices, setOrderLinePrices] = useState<Array<OrderLinePrice>>([]);
  const [locationsProfits, setLocationsProfits] = useState<Array<ProfitProps>>([]);
  const [biggerLocationProfit, setBiggerLocationProfit] = useState<ProfitProps | undefined>(undefined);

  const updateOrderLinePrices = useCallback((location: Location, line: OrderLine) => {
    const price = initialValues.prices.find(price => price.product === line.product && price.location === location.id);
    if (price != null) {
      const linePrice = getOrderLinePrice(price.price, line.quantity);

      if (linePrice != null) {
        const newItem = {
          location: location.id,
          product: line.product,
          price: price.price,
          linePrice,
        };
        const index = orderLinePrices?.findIndex(pricesMap => pricesMap.product === line.product && pricesMap.location === location.id);

        const copy = orderLinePrices;
        if (index === -1) {
          copy.push(newItem);
        } else {
          copy[index] = newItem;
        }
        setOrderLinePrices(copy);
      }
    }
  }, [getOrderLinePrice, initialValues.prices, orderLinePrices]);

  const updateBiggerLocationProfit = useCallback((deliveryCosts: ProfitProps) => {
    if (biggerLocationProfit == null || 
      (deliveryCosts.profit != null && biggerLocationProfit.profit != null && deliveryCosts.profit.units > biggerLocationProfit.profit.units)) {
      setBiggerLocationProfit(deliveryCosts);
      return true;
    }
    return false;
  }, [biggerLocationProfit]);

  const updateLocationsProfits = useCallback((location: Location) => {
    const deliveryCosts = getDeliveryCosts({ location, prices: orderLinePrices });
    if (deliveryCosts != null) {
      const index = locationsProfits?.findIndex(locationMap => locationMap.location.id === location.id);

      const copy = locationsProfits;
      if (index === -1) {
        copy.push(deliveryCosts);
      } else {
        copy[index] = deliveryCosts;
      }
      setLocationsProfits(copy);

      updateBiggerLocationProfit(deliveryCosts);
    }
  }, [getDeliveryCosts, locationsProfits, orderLinePrices, updateBiggerLocationProfit]);

  useEffect(() => {
    const validWeight = checkOrderWeight(initialValues.order.lines, initialValues.vehicle.authorizedMaximumWeight);
    if (validWeight === true) {

      initialValues.locations.map(location => {
        initialValues.order.lines.map(line => updateOrderLinePrices(location, line));
        updateLocationsProfits(location);
        return location;
      });
    }
  }, [checkOrderWeight, updateLocationsProfits, updateOrderLinePrices,
      initialValues.locations, initialValues.order.lines, initialValues.vehicle.authorizedMaximumWeight]);
  
  return <LocationProfitContext.Provider value={{
    ...initialValues,
    orderLinePrices,
    locationsProfits,
    biggerLocationProfit,
  }}>
    {children}
  </LocationProfitContext.Provider>;
}

const useLocationProfitContext = () => {
  const context = useContext(LocationProfitContext);
  if (context === undefined) {
    throw new Error('useLocationProfitContext must be used within LocationProfitProvider');
  }
  return context;
};

export { useLocationProfitContext, LocationProfitProvider };
