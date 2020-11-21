import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Home from '../../../../pages/Home';

describe('Home', () => {
  let testSubject;
  beforeEach(() => {
    const { getByText } = render(<Home />);
    testSubject = getByText;
  });

  it('renders Home page', () => {
    const homeText = testSubject('I am the Home page.', { exact: false });
    expect(homeText).toBeInTheDocument();
  });

  it('has the link to Create Record', () => {
    const linkElement = testSubject('Record creation', { exact: true });

    expect(linkElement).toBeInTheDocument();
    expect(document.querySelector("a").getAttribute("href")).toBe(
      "/create-record"
    );
  });
});
