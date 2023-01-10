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
const postsList = document.getElementById('posts-list');
const feedsList = document.getElementById('feeds-list');
const feedsHeader = document.getElementById('feeds-header');
const postsHeader = document.getElementById('posts-header');

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

  if (path === 'feedItems') {
    postsList.innerHTML = value.map((item) => `<li class="list-group-item d-flex justify-content-between align-items-start border-0 border-end-0"><a href="${item.link}" class="fw-bold" data-id="${item.id}" target="_blank" >${item.title}</a><button type="button" class="btn btn-outline-primary btn-sm" id="${item.id}" data-bs-toggle="modal" data-bs-target="#modal">${i18nextInstance.t('OPEN')}</button></li>`).join('');
    postsHeader.hidden = false;
  }

  if (path === 'feedSources') {
    feedsList.innerHTML = value.map((item) => `<li class="list-group-item border-0 border-end-0"><h3 class="h6 m-0">${item.title}</h3><p class="m-0 small text-black-50">${item.description}</p></li>`).join('');
    feedsHeader.hidden = false;
  }

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
      try {
        const feedData = parseRss(content);
        watchedObject.feedItems = [...feedData.items, ...state.feedItems];
        watchedObject.feedSources = [feedData.feed, ...state.feedSources];
        state.feedsUrls.push(value);
        state.inputValue = '';

        resetInputValidityView(true);
        feedForm.reset();
      } catch (error) {
        throw new Error('URL_NO_DATA_VALIDATION_ERROR');
      }
    })
      .catch((err) => {
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
