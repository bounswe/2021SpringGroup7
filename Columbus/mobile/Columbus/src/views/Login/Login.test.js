import React from 'react';

import {render} from '../../utils/testUtils';

import Login from './Login';
describe('<Login/>', () => {
  it('renders default Login page', () => {
    const {getByText} = render(<Login />);

    const welcomeText = getByText('Welcome');

    expect(welcomeText).toBeDefined();
  });
});
