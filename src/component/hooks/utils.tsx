import { CurrencyProps, MeasureProps } from "../types";
import { CurrencyValues, MeasureValues, Measure } from "../constants";

export const formatNumber = (number?: number) => {
  // Note: We use DE locale to show millar formart with dot, becouse ES only use it from 10k 
  return number?.toLocaleString('de-DE');
}

export const formatCurrency = (price?: CurrencyProps & { measure?: Measure }) => {
  return price != null && price.units > 0 ? 
    `${formatNumber(price.units)} ${price.currency}${price.measure != null ? `/${price.measure}` : ''}` : 
    `0 ${CurrencyValues.EUR}`;
}

export const formatMeasure = (item?: MeasureProps) => {
  return item != null && item.units > 0 ? `${formatNumber(item.units)} ${item.measure}` : `0 ${MeasureValues.KM}`;
}
