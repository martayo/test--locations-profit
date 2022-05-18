import { Story } from '@storybook/react';

import LocationsProfit, { LocationProfitProps } from '../LocationsProfit';
import data from '../../data';

export default {
  title: 'Locations Profit',
  component: LocationsProfit,
};

const Template: Story<LocationProfitProps> = (args) => <LocationsProfit {...args} />;

export const base = Template.bind({});
base.args = {...data};
