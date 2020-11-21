
import React from 'react';
import { Input , ErrorSummary, Fieldset } from 'govuk-react-jsx';
import { useForm } from 'react-hook-form';
import { Helmet } from 'react-helmet';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import axios from 'axios';

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

export default function App() {
  const createLSUri = '/create-record';
  const [record, setRecord] = React.useState({});
  const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/

  const FormValidationSchema = yup.object().shape({
    forenames: yup.string().matches(/^[a-zA-Z\s]+$/, { message: 'Please provide your forenames', excludeEmptyString: false }),
    surname: yup.string().matches(/^[a-zA-Z\s]+$/, { message: 'Please provide your surname', excludeEmptyString: true }).min(2, 'Please provide your surname'),
    staffId: yup.string().min(9, 'A staff ID number usually consists of 9 digits').max(9, 'A staff ID number usually consists of 9 digits'),
    telephone: yup.string().matches(phoneRegExp, 'Please provide a telephone number'),
  });

  const { register, handleSubmit, errors, reset, getValues } = useForm({
    reValidateMode: 'onSubmit',
    submitFocusError: false,
    resolver: yupResolver(FormValidationSchema)
  });

  const onSubmit = (data) => {
    console.info('Submitting data to: ', createLSUri);
    console.log(JSON.safeStringify(data));;
    const timeoutMilliseconds = 5000;

    axios({
      method: 'POST',
      url: createLSUri,
      data: data,
      timeout: timeoutMilliseconds,
    }).then((response)=>{
      if (response.status === 200) {
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
      }

      console.error(JSON.safeStringify(errMessage));
    })
  };

  return (
    <div className="govuk-body">
      <h1>Create Record</h1>

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
                label={{
                  children: [
                    'Forenames'
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

