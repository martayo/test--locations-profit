import { createContext, useContext, useState, ReactNode } from 'react';

import { Product, Order, Price, Location, Vehicle } from '../types';

interface LocationProfitProps {
  products?: Array<Product>;
  order?: Order;
  locations: Array<Location>;
  prices?: Array<Price>;
  vehicle?: Vehicle;
}

interface ProfitProps {
  location: Location;
  product?: Product;
  units: number;
  currency: string;
}

interface ProviderProps {
  children: ReactNode;
  initialValues: LocationProfitProps;
}
interface ContextProps extends LocationProfitProps {
  locationsProfits: Array<ProfitProps>;
  updateLocationProfit: (props: ProfitProps) => void;
  biggerLocationProfit: () => ProfitProps | undefined;
}

const LocationProfitContext = createContext<ContextProps | undefined>(undefined);

const LocationProfitProvider = ({ children, initialValues }: ProviderProps) => {
  const [locationsProfits, setLocationsProfits] = useState<Array<ProfitProps>>([]);

  const updateLocationProfit = ({ location, product, units, currency }: ProfitProps) => {
    const index = locationsProfits?.findIndex(locationMap => {
      return locationMap.location.id === location.id && locationMap.product?.id === product?.id
    });
    if (index === -1) {
      const copy = locationsProfits;
      copy.push({
        location,
        product,
        units,
        currency,
      });
      setLocationsProfits(copy);
    } else {
      setLocationsProfits(
        locationsProfits?.map(locationMap => {
          if (locationMap.location.id === location.id && locationMap.product?.id === product?.id) {
            locationMap.units = units;
            locationMap.currency = currency;
          }
          return locationMap;
        })
      );
    }
  }

  const groupByLocation = (items: Array<ProfitProps>) => {
    return items.reduce((group, item) => {
      const key = item.location.id.toString();
      if (group[key] == null) {
        group[key] = {
          location: item.location,
          units: item.units,
          currency: item.currency,
        };
      } else {
        group[key].units += item.units;
      }
      return group;
    }, {} as Record<string, ProfitProps>);
  }

  const sortByUnits = (items: Array<ProfitProps>) => {
    return items.sort((a, b) => {
      if ( a.units === b.units ) {
        return 0;
      }
      return a.units > b.units ? 1 : -1;
    });
  }

  const biggerLocationProfit = () => {
    const profitsByLocation = groupByLocation(locationsProfits);
    var sorted = sortByUnits(Object.values(profitsByLocation)).reverse();
    return sorted[0];

  }

  return <LocationProfitContext.Provider value={{
    ...initialValues,
    locationsProfits,
    updateLocationProfit,
    biggerLocationProfit,
  }}>
    {children}
  </LocationProfitContext.Provider>;
}

const useLocationProfitContext = () => {
  const context = useContext(LocationProfitContext);
  if (context === undefined) {
    throw new Error('useLocationProfit must be used within LocationProfitProvider');
  }
  return context;
};

export { useLocationProfitContext, LocationProfitProvider };
