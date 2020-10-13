import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Cookies from '../../../../pages/Cookies';

describe('Cookies', () => {
  let testSubject;
  beforeEach(() => {
    const { getByText } = render(<Cookies />);
    testSubject = getByText;
  });

  it('renders Cookies page', () => {
    const homeText = testSubject('I am the Cookies page', { exact: false });
    expect(homeText).toBeInTheDocument();
  });

});
