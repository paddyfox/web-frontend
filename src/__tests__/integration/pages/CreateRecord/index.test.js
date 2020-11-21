import React from 'react';
import { render, fireEvent, waitFor, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { act } from 'react-dom/test-utils';

import CreateRecord from '../../../../pages/CreateRecord';

require('mutationobserver-shim');

act(() => ({ then: () => {} })) // this fixes the test
    .then(() => {}) // this suppresses the 'act without await' warning

describe('CreateRecord', () => {
    let testSubject, testByLabel, testByRole, testByTestId;
    describe('renders expected form elements', () => {
        beforeEach(() => {
            const { getByText, getByLabelText, getByRole, getByTestId } = render(<CreateRecord />);
            testSubject = getByText;
            testByLabel = getByLabelText;
            testByRole = getByRole;
            testByTestId = getByTestId;
        });

        it('renders CreateRecord heading', () => {
            const CreateRecordText = testSubject('Create Record', { exact: false });
            expect(CreateRecordText).toBeInTheDocument();
            expect(CreateRecordText[Object.keys(CreateRecordText)[0]].type).toBe('h1');
        });

        it('renders the Forenames input', () => {
            const CreateRecordText = testByRole('textbox', { name: 'Forenames', exact: true });
            expect(CreateRecordText).toBeInTheDocument();
        });

        it('renders the Surname input', () => {
            const CreateRecordText = testSubject('Surname', { exact: true });
            expect(CreateRecordText).toBeInTheDocument();
        });

        it('renders the Telephone input', () => {
            const CreateRecordText = testByLabel('Phone Number', { exact: true });
            expect(CreateRecordText).toBeInTheDocument();
        });

        it('renders the Staff ID input', () => {
            const CreateRecordText = testByLabel('Staff ID', { exact: false });
            expect(CreateRecordText).toBeInTheDocument();
        });
    })

    describe('with invalid inputs', () => {
        afterEach(cleanup);

        it('submits the form', () => {
            const onSubmit = jest.fn();
            const handleSubmit = jest.fn();
            const { getByTestId } = render(<CreateRecord onSubmit={handleSubmit(onSubmit)} />);
            const sub = getByTestId('form');
            fireEvent.submit(sub);

            expect(handleSubmit).toHaveBeenCalledTimes(1);
            expect(onSubmit).toHaveBeenCalledTimes(0);
        });

        it('displays error on invalid surname', async () => {
            const { container } = render(<CreateRecord />);
            const inputEntry = name => container.querySelector(
                `input[name='${name}']`
            );
            const submitButton = container.querySelector(
                "button[type='submit']"
            );

            fireEvent.input(inputEntry('surname'), {
                target: {
                    value: '123'
                }
            });
            fireEvent.input(inputEntry('forenames'), {
                target: {
                    value: 'ASD123'
                }
            });

            await act(async () => {
                fireEvent.submit(submitButton);
            });

            await waitFor(() => expect(container.textContent).toContain(
                /Please provide your surname/
                )
            );
        });
    });
});
