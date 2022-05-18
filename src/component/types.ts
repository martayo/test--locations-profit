import { Measure, Currency } from './constants';

export interface CurrencyProps {
  units: number;
  currency: Currency;
}
export interface MeasureProps {
  units: number;
  measure: Measure;
}

export interface Product {
  id: number | string;
  name: string;
  image?: string;
}

export interface Order {
  id: number | string;
  lines: Array<OrderLine>;
}
export interface OrderLine {
  product: number | string;
  quantity: MeasureProps;
}

export interface Location {
  id: number | string;
  name: string;
  distance: MeasureProps;
}

export interface Price {
  product: number | string;
  location: number | string;
  price: MeasureProps & {
    currency: Currency;
  };
}

export interface Vehicle {
  id: number | string;
  name: string;
  authorizedMaximumWeight: MeasureProps;
}
