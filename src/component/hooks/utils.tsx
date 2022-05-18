import { Location, Product, Price } from "../types";

interface ProfitProps {
  location: Location;
  product?: Product;
  units: number;
  currency: string;
}

export const findProductById = (products: Array<Product>, id: string | number) => {
  return products.find(product => product.id === id);
}

export const findPriceByProductAndLocation = (
  prices: Array<Price>,
  productId: string | number,
  locationId: string | number,
) => {
  return prices.find(price => price.product === productId && price.location === locationId);
}

export const formatNumber = (number?: number) => {
  // Note: We use DE locale to show millar formart with dot, becouse ES only use it from 10k 
  return number?.toLocaleString('de-DE');
}
