import * as yup from 'yup';
import state from './state.js';

export const generateId = (value) => btoa(unescape(encodeURIComponent(value))).slice(0, 20);

export const formValidationSchema = yup.object().shape({
  inputValue: yup.string()
    .url('URL_VALIDATION_ERROR')
    .test('value-duplicate', 'VALUE_DUPLICATE_ERROR', (value) => state.feedsUrls.every((source) => value !== source))
    .required('REQUIRED_VALIDATION_ERROR'),
});

export const parseRssResponse = (response) => {
  if (!response.data?.status?.error && response.data?.contents) {
    return response.data.contents;
  }
  throw new Error('URL_NO_DATA_VALIDATION_ERROR');
};
