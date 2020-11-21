import * as yup from 'yup';
import XRegExp from 'xregexp';
import { has } from 'ramda';

const capitalize = str => {
  if(typeof str === 'string') {
      return str.replace(/^\w/, c => c.toUpperCase());
  } else {
      return '';
  }
};

// Accepts: 044 1234 123 123 or 1234 123 123 or 1234123123 (any length).
// Accepts: +44 1234 123 123 or 1234 123 123 or 1234123123 (any length).
const phoneRegExp = /^((\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

const nameInternationalRegExp = XRegExp.build("^[\\p{L}-,' .]+$");

const nameValidationSchema = props => {
  const input = {
    name: has('name')(props) ? props.name : 'name',
    max: has('max')(props) ? props.max : 30
  };

  return yup
    .string()
    .required(`Please provide your ${input.name}`)
    .transform(value => value.trim())
    .max(input.max, capitalize(input.name) + ` seems to be too long`)
    .matches(
      nameInternationalRegExp,
      { message: `Please provide your ${input.name}`,
      excludeEmptyString: false
    });
};

const staffIDValidationSchema = () => yup
  .string()
  .matches(
    /^\d{9}$/,
    { message: 'A Staff ID usually consists of 9 digits',
    excludeEmptyString: true
  });

const phoneNumberValidationSchema = () => yup
  .string()
  .test(
    'telephone',
    'Please provide a valid telephone number',
    function(value) {
      if (!value) {
        return true;
      }

      return yup
        .string()
        .matches(
          phoneRegExp,
          'Please provide a valid telephone number'
        )
        .isValidSync(value);
    }
  );

export {
  capitalize,
  nameValidationSchema,
  staffIDValidationSchema,
  phoneNumberValidationSchema
};
