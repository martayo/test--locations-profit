import { Product } from '../types';
import { ProductDetails } from '../styles/orderLineCard';
import { useLocationProfitContext, formatMeasure } from '../hooks';

interface Props {
  product: Product;
}

const ProductCard = ({ product }: Props) => {
  const { order } = useLocationProfitContext();
  const line = order.lines.find(line => line.product === product.id);
  if (product == null || line == null) {
    return null;
  }

  return (
    <ProductDetails>
      { product.image != null && <img src={product.image} alt={product.name} /> }
      <h2>{product.name}</h2>
      <div>{formatMeasure(line.quantity)}</div>
    </ProductDetails>
  );
};

export default ProductCard;
