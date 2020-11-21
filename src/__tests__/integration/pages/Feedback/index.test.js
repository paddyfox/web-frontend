import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Feedback from '../../../../pages/Feedback';

describe('Feedback', () => {
  let testSubject;
  beforeEach(() => {
    const { getByText } = render(<Feedback />);
    testSubject = getByText;
  });

  it('renders Feedback page', () => {
    const homeText = testSubject('I am the Feedback Page.', { exact: false });
    expect(homeText).toBeInTheDocument();
  });

});
