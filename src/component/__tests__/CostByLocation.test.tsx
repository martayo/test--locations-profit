import { ReactNode } from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import { Location } from '../types';
import { LocationProfitProvider } from '../hooks';
import { CostByLocation } from '../elements';

describe('CostByLocation', () => {
  const setup = () => {
    const args = {
      products: [
        { id: 11, name: 'Product 1' },
        { id: 12, name: 'Product 2' },
      ],
      order: {
        id: 1,
        lines: [
          { product: 11, quantity: { units: 50, measure: 'kg' } },
          { product: 12, quantity: { units: 100, measure: 'kg' } },
        ],
      },
      locations: [{ id: 1, name: 'Location', distance: { units: 900, measure: 'km' } }],
      prices: [
        { product: 11, location: 1, price: { units: 500, currency: '€', measure: 'kg' } },
        { product: 12, location: 1, price: { units: 1, currency: '€', measure: 'kg' } },
      ],
      vehicle: { id: 1, name: 'Vehicle', authorizedMaximumWeight: { units: 200, measure: 'kg' } },
    };

    const wrapper = ({ children }: { children: ReactNode }) => (
      <LocationProfitProvider initialValues={{ ...args }}>
        {children}
      </LocationProfitProvider>
    );
    const renderComponent = (location: Location) => render(<CostByLocation location={location} />, { wrapper });

    return {
      args,
      renderComponent,
    };
  };

  it('renders', async () => {
    const { args, renderComponent } = setup();
    renderComponent(args.locations[0]);

    expect(await screen.findByText(/Precio total: 25.100 €/)).toBeInTheDocument();
    expect(await screen.findByText(/Beneficio: 21.036 €/)).toBeInTheDocument();
  });
});
