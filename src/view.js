import onChange from 'on-change';
import axios from 'axios';
import { state } from './state.js';
import { schema } from './utils.js';
import { i18nextInstance } from './i18n.js';
import { parseRss } from './rss-parser.js';

const feedForm = document.getElementById('rss-feed-form');
const feedInput = document.getElementById('rss-feed-input');
const inputValidationErrorDiv = document.getElementById('validation-error');
const formSubmitButton = document.getElementById('form-submit');

const resetInputValidityView = (isValid, error) => {
  if (isValid) {
    feedInput.classList.add('is-valid');
    feedInput.classList.remove('is-invalid');
    inputValidationErrorDiv.classList.add('valid-feedback');
    inputValidationErrorDiv.classList.remove('invalid-feedback');
    inputValidationErrorDiv.innerHTML = i18nextInstance.t('SUCCESS');
  } else {
    inputValidationErrorDiv.innerHTML = i18nextInstance.t(error);
    feedInput.classList.add('is-invalid');
    feedInput.classList.remove('is-valid');
    inputValidationErrorDiv.classList.add('invalid-feedback');
    inputValidationErrorDiv.classList.remove('valid-feedback');
  }
};

// eslint-disable-next-line no-unused-vars
export const watchedObject = onChange(state, (path, value, previousValue, applyData) => {
//   console.log('state: ', state);
//   console.log('this:', this);
//   console.log('path:', path);
//   console.log('value:', value);
//   console.log('previousValue:', previousValue);
//   console.log('applyData:', applyData);
  if (path === 'loading') {
    feedInput.disabled = value;
    formSubmitButton.disabled = value;
  }

  if (path === 'inputValue') {
    schema.validate({ inputValue: value }).then(() => {
      watchedObject.loading = true;
      return axios.get(`https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(value)}`);
    }).then((response) => {
      if (!response.data.status.error && response.data.contents) {
        return response.data.contents;
      }
      throw new Error('URL_NO_DATA_VALIDATION_ERROR');
    }).then((content) => {
      parseRss(content);
      resetInputValidityView(true);
      state.feedsUrls.push(value);
      state.inputValue = '';
      feedForm.reset();
    })
      .catch((err) => {
        console.log('err: ', err,);
        if (err.code === 'ERR_NETWORK') {
          return Promise.reject(err.code);
        }

        if (err?.errors) {
          return Promise.reject(err.errors[0]);
        }
        return Promise.reject(err.message);
      })
      .catch(((err) => {
        resetInputValidityView(false, err);
      }))
      .finally(() => {
        watchedObject.loading = false;
      });
  }
});
