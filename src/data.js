const data = {
  products: [
    { id: 111, name: 'Vieiras', image: 'https://img.freepik.com/foto-gratis/vieiras-frescas-crudas-limpias-blanco_131238-21.jpg' },
    { id: 222, name: 'Pulpo', image: 'https://t2.uc.ltmcdn.com/es/posts/2/2/7/como_cocer_el_pulpo_23722_600.jpg' },
    { id: 333, name: 'Centollos', image: 'https://tierraymardistribucion.com/wp-content/uploads/2021/02/600x600_Centollo-fresco.png' },
  ],
  order: {
    id: '22/0001',
    lines: [
      { product: 111, quantity: { units: 50, measure: 'kg' } },
      { product: 222, quantity: { units: 100, measure: 'kg' } },
      { product: 333, quantity: { units: 50, measure: 'kg' } },
    ],
  },
  locations: [
    { id: 'MAD', name: 'Madrid', distance: { units: 800, measure: 'km' } },
    { id: 'BCN', name: 'Barcelona', distance: { units: 1100, measure: 'km' } },
    { id: 'LIS', name: 'Lisboa', distance: { units: 600, measure: 'km' } },
  ],
  prices: [
    { product: 111, location: 'MAD', price: { units: 500, currency: '€', measure: 'kg' } },
    { product: 222, location: 'MAD', price: { units: 0, currency: '€', measure: 'kg' } },
    { product: 333, location: 'MAD', price: { units: 450, currency: '€', measure: 'kg' } },
    { product: 111, location: 'BCN', price: { units: 450, currency: '€', measure: 'kg' } },
    { product: 222, location: 'BCN', price: { units: 120, currency: '€', measure: 'kg' } },
    { product: 333, location: 'BCN', price: { units: 0, currency: '€', measure: 'kg' } },
    { product: 111, location: 'LIS', price: { units: 600, currency: '€', measure: 'kg' } },
    { product: 222, location: 'LIS', price: { units: 100, currency: '€', measure: 'kg' } },
    { product: 333, location: 'LIS', price: { units: 500, currency: '€', measure: 'kg' } },
  ],
  vehicle: { id: '1234BCD', name: 'Volkswagen 1234-BCD', authorizedMaximumWeight: { units: 200, measure: 'kg' } },
};

export default data;
