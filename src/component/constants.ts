const MeasureValues = {
  KG: 'kg',
  KM: 'km',
};
export type Measure = typeof MeasureValues[keyof typeof MeasureValues];

export const CurrencyValues = {
  EUR: '€',
};
export type Currency = typeof CurrencyValues[keyof typeof CurrencyValues];

export const CostPerTravel = {
  units: 5,
  currency: CurrencyValues.EUR,
};

export const CostPerKilometer = {
  units: 2,
  currency: CurrencyValues.EUR,
  measure: MeasureValues.KM,
};

export const DevaluationPerKilometer = {
  units: 1 / 100,
  currency: CurrencyValues.EUR,
  measure: MeasureValues.KM,
};
