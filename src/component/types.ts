import { Measure, Currency } from './constants';

export interface CurrencyProps {
  units: number;
  currency: Currency;
}
export interface MeasureProps {
  units: number;
  measure: Measure;
}

export type IdType = number | string;

export interface Product {
  id: IdType;
  name: string;
  image?: string;
}

export interface Order {
  id: IdType;
  lines: Array<OrderLine>;
}
export interface OrderLine {
  product: IdType;
  quantity: MeasureProps;
}

export interface Location {
  id: IdType;
  name: string;
  distance: MeasureProps;
}

export interface Price {
  product: IdType;
  location: IdType;
  price: MeasureProps & {
    currency: Currency;
  };
}

export interface Vehicle {
  id: IdType;
  name: string;
  authorizedMaximumWeight: MeasureProps;
}
