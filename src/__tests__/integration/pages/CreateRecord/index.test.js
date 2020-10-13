import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { act } from 'react-dom/test-utils';

import CreateRecord from '../../../../pages/CreateRecord';

require('mutationobserver-shim');

act(() => ({ then: () => {} })) // this fixes the test
  .then(() => {}) // this suppresses the 'act without await' warning

const onSubmit = jest.fn((forenames) => {
  console.log('******');
  return Promise.resolve({ forenames });
});;

describe('CreateRecord', () => {
  let testSubject, testByLabel;
  beforeEach(() => {
    const { getByText, getByLabelText } = render(<CreateRecord login={onSubmit}/>);
    testSubject = getByText;
    testByLabel = getByLabelText;
  });

  describe('renders expected form elements', () => {
    it('renders CreateRecord page', () => {
      const CreateRecordText = testSubject('Create Record', { exact: false });
      expect(CreateRecordText).toBeInTheDocument();
    });
    it('renders the Forenames input', () => {
      const CreateRecordText = testByLabel('Forenames', { exact: true });
      expect(CreateRecordText).toBeInTheDocument();
    });

    it('renders the Surname input', () => {
      const CreateRecordText = testByLabel('Surname', { exact: true });
      expect(CreateRecordText).toBeInTheDocument();
    });

    it('renders the Staff ID input', () => {
      const CreateRecordText = testByLabel('Staff ID', { exact: true });
      expect(CreateRecordText).toBeInTheDocument();
    });

    it('renders the Telephone input', () => {
      const CreateRecordText = testByLabel('Phone Number', { exact: true });
      expect(CreateRecordText).toBeInTheDocument();
    });
  })

  describe('with valid inputs', () => {
    it('submits the form and passes validation', async () => {
        const field = await testByLabel('Forenames');
        fireEvent.change(field, { target: { value: 'John James' } });
        fireEvent.change(testByLabel('Surname'), { target: { value: 'Smyth' } });
        fireEvent.change(testByLabel('Staff ID'), { target: { value: '123456789' } });
        fireEvent.change(testByLabel('Phone Number'), { target: { value: '0447700000009' } });

        const sub = await screen.getByTestId('submitButton');
        fireEvent.submit(sub);;

        expect(testByLabel('Surname').value).toBe('Smyth');
        expect(testByLabel('Forenames').value).toBe('John James');
        expect(testByLabel('Staff ID').value).toBe('123456789');
        const CreateRecordText = testByLabel('Phone Number', { exact: true });
        expect(CreateRecordText).toBeInTheDocument();
        expect(onSubmit).toBeCalledTimes(0);
    });
  });
});
