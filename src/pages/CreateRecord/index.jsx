import React, { useState } from 'react';
import { Input , ErrorSummary, Radios, Textarea } from 'govuk-react-jsx';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
// import { isExists } from 'date-fns';
import { yupResolver } from '@hookform/resolvers/yup';
import axios from 'axios';

import {
    nameValidationSchema,
    staffIDValidationSchema,
    phoneNumberValidationSchema
} from '../../utils';

// Safely handles circular references.
JSON.safeStringify = (obj, indent = 2) => {
    let cache = [];
    const retVal = JSON.stringify(
        obj,
        (key, value) =>
            typeof value === "object" && value !== null
                ? cache.includes(value)
                ? undefined // Duplicate reference found, discard key.
                : cache.push(value) && value // Store value in our collection.
                : value,
        indent
    );
    cache = null;
    return retVal;
};

export default function CreateRecord() {
    const createRecordUri = '/create-record';
    const [record, setRecord] = React.useState({});

    const formValidationSchema = yup.object().shape({
        surname: nameValidationSchema({ name: 'surname' }),
        forenames: nameValidationSchema({ name: 'forename(s)' }),
        staffID: staffIDValidationSchema( {staffId: 'staff ID'}),
        telephone: phoneNumberValidationSchema(),
    });

    const { register, handleSubmit, errors, reset, getValues } = useForm({
        mode: 'onSubmit',
        reValidateMode: 'onSubmit',
        submitFocusError: false,
        shouldFocusError: true,
        resolver: yupResolver(formValidationSchema)
    });

    const onSubmit = (data) => {
        console.info('Submitting data to: ', createRecordUri);
        console.log(JSON.safeStringify(data));;
        const timeoutMilliseconds = 5000;

        axios.post(
            createRecordUri,
            data,
            {
                timeout: timeoutMilliseconds,
            }).then((response) => {
            if (response.status === 200) {
                console.log(response.data);
                setRecord(response.data);
                reset();
            } else {
                console.error(`Form submission failed with response status code ${response.status}`);
            }
        }).catch((err) => {
            const errMessage = {
                status: 'error',
                code: 500,
                message: `FRONTEND app failed to initiate communication to FRONTEND server.`,
                details: err
            };

            console.error(errMessage);
        })
    };

    return (
        <div className="govuk-body">
            <h1>Create Record </h1>
            <div className="govuk-grid-row">
                <div className="govuk-grid-column-two-thirds">
                    {Object.keys(errors).length !== 0 && (
                        <ErrorSummary
                            errorList={Object.entries(errors).map((error) => {
                                return {
                                    href: `#${error[0]}`,
                                    children: `${error[1].message}`,
                                }
                            })
                            }
                        />
                    )}

                    <form id="createLSForm" onSubmit={handleSubmit(onSubmit)} method="POST">
                        <Input
                            id="forenames"
                            maxLength="30"
                            label={{
                                children: [
                                    'Forename(s)'
                                ]
                            }}
                            name="forenames"
                            type="text"
                            ref={register()}
                            {...(errors.forenames && {
                                errorMessage: {
                                    children: errors.forenames.message,
                                },
                            })}
                        />
                        <Input
                            id="surname"
                            maxLength="30"
                            label={{
                                children: [
                                    'Surname'
                                ]
                            }}
                            name="surname"
                            type="text"
                            ref={register()}
                            {...(errors.surname && {
                                errorMessage: {
                                    children: errors.surname.message,
                                },
                            })}
                        />
                        <Input
                            id="telephone"
                            maxLength="20"
                            label={{
                                children: [
                                    'Phone Number'
                                ]
                            }}
                            name="telephone"
                            type="text"
                            ref={register()}
                            {...(errors.telephone && {
                                errorMessage: {
                                    children: errors.telephone.message,
                                },
                            })}
                        />
                        <Input
                            id="staffID"
                            maxLength="9"
                            hint={{
                                children:
                                    'For Example: 554367869',
                            }}
                            label={{
                                children: [
                                    'Staff ID'
                                ]
                            }}
                            name="staffID"
                            type="text"
                            ref={register()}
                            {...(errors['staffID'] && {
                                errorMessage: {
                                    children: errors['staffID'].message,
                                },
                            })}
                        />

                        <button id="submitButton" type="submit" data-testid="submitButton" className="govuk-button">Submit</button>
                    </form>
                </div>
                <div className="govuk-grid-column-one-third">
                    <h2 className="govuk-heading-m">Form data</h2>
                    <code>
                        <pre>{JSON.stringify(getValues(), null, 2)}</pre>
                        <pre>{JSON.stringify(record, null, 2)}</pre>
                    </code>
                </div>
            </div>
        </div>
    );
}

