import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { shallow } from 'enzyme';

import { App } from '../../App';

describe('App', () => {
  it('renders without crashing', () => {
    shallow(<App />);
  });
});
