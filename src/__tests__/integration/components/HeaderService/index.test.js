import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import HeaderService from '../../../../components/HeaderService';

describe('HeaderService', () => {
  let testSubject;
  beforeEach(() => {
    const { getByText } = render(<HeaderService />);
    testSubject = getByText;
  });

  it('renders HeaderService page', () => {
    const homeText = testSubject('This is a web frontend service for teaching testing', { exact: false });
    expect(homeText).toBeInTheDocument();
  });

});
