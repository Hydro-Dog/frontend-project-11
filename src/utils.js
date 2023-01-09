import * as yup from 'yup';
import { state } from './state.js';

export const schema = yup.object().shape({
  inputValue: yup.string()
    .url('URL_VALIDATION_ERROR')
    .test('value-duplicate', 'VALUE_DUPLICATE_ERROR', (value) => state.feedsUrls.every((source) => value !== source))
    .required('REQUIRED_VALIDATION_ERROR'),
});

export const generateId = () => Math.floor((1 + Math.random()) * 0x10000)
  .toString(16)
  .substring(1);
