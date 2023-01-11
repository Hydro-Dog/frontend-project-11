import onChange from 'on-change';
import axios from 'axios';
import { state } from './state.js';
import { formValidationSchema, parseRssResponse } from './utils.js';
import { i18nextInstance } from './i18n.js';
import { parseRss } from './rss-parser.js';
import { ALL_ORIGINS_URL } from './constants.js';

export const feedForm = document.getElementById('rss-feed-form');
export const feedInput = document.getElementById('rss-feed-input');
export const exampleBlock = document.getElementById('example-block');
export const feedInputLabel = document.getElementById('input-label');
export const inputValidationErrorDiv = document.getElementById('validation-message');
export const formSubmitButton = document.getElementById('form-submit');
export const postsList = document.getElementById('posts-list');
export const feedsList = document.getElementById('feeds-list');
export const feedsHeader = document.getElementById('feeds-header');
export const postsHeader = document.getElementById('posts-header');
export const closeModalButton = document.getElementById('close-modal');
export const readFullPostButton = document.getElementById('read-full-post');

const resetInputValidityView = (fieldState, error = '') => {
  if (fieldState === 'success') {
    feedInput.classList.add('is-valid');
    feedInput.classList.remove('is-invalid');
    inputValidationErrorDiv.classList.add('valid-feedback');
    inputValidationErrorDiv.classList.remove('invalid-feedback');
    inputValidationErrorDiv.innerHTML = i18nextInstance.t('SUCCESS');
  } else if (fieldState === 'error') {
    inputValidationErrorDiv.innerHTML = i18nextInstance.t(error);
    feedInput.classList.add('is-invalid');
    feedInput.classList.remove('is-valid');
    inputValidationErrorDiv.classList.add('invalid-feedback');
    inputValidationErrorDiv.classList.remove('valid-feedback');
  } else {
    inputValidationErrorDiv.innerHTML = '';
    feedInput.classList.remove('is-invalid');
    feedInput.classList.remove('is-valid');
    inputValidationErrorDiv.classList.remove('invalid-feedback');
    inputValidationErrorDiv.classList.remove('valid-feedback');
  }
};

const shouldUpdateFeedItems = (items, stateItems) => {
  for (let i = 0; i < items.length; i += 1) {
    const id = btoa(unescape(encodeURIComponent(items[i].title))).slice(0, 19);
    if (stateItems[id]) {
      return false;
    }
  }
  return true;
};

const shouldUpdateFeedSources = (feedSources, stateFeedSources) => {
  for (let i = 0; i < feedSources.length; i += 1) {
    const id = btoa(unescape(encodeURIComponent(feedSources[i].title))).slice(0, 19);
    if (stateFeedSources[id]) {
      return false;
    }
  }
  return true;
};

const setPostAsVisited = (id) => {
  const element = document.getElementById(id);
  element.classList.add('fw-normal');
  element.classList.remove('fw-bold');
};

const initModal = (posts) => {
  const modal = document.getElementById('modal');
  modal.addEventListener('show.bs.modal', (event) => {
    const button = event.relatedTarget;
    const id = button.getAttribute('data-id');
    const post = posts[id];

    setPostAsVisited(id);

    const modalTitle = modal.querySelector('#modal-title');
    const modalBody = modal.querySelector('#modal-body');
    const readButtonLink = modal.querySelector('#read-full-post-link');

    modalTitle.textContent = post.title;
    modalBody.textContent = post.description;
    readButtonLink.href = post.link;
    readButtonLink.textContent = i18nextInstance.t('READ');
  });
};

export const watchedObject = onChange(state, (path, value) => {
  const updateFeed = (url, updateFormState = true) => axios.get(`${ALL_ORIGINS_URL}/get?disableCache=true&url=${encodeURIComponent(url)}`).then((response) => parseRssResponse(response)).then((content) => {
    try {
      const feedData = parseRss(content);

      if (shouldUpdateFeedItems(feedData.items, state.feedItems)) {
        watchedObject.feedItems = {
          ...state.feedItems,
          ...feedData.items.reduce((acc, item) => ({ ...acc, [item.id]: item }), {}),
        };
      }

      if (shouldUpdateFeedSources(feedData.feed, state.feedSources)) {
        watchedObject.feedSources = {
          ...state.feedSources,
          [feedData.feed.id]: feedData.feed,
        };
      }

      watchedObject.feedsUrls = [...state.feedsUrls, value];

      if (updateFormState) {
        state.inputValue = '';
        setTimeout(() => {
          feedInput.focus();
        }, 0);
        feedForm.reset();
        watchedObject.loading = false;
        resetInputValidityView('success');
      }
    } catch (error) {
      throw new Error('data parse error');
    }
  }).then(() => new Promise((res) => {
    setTimeout(() => { res(updateFeed(url, false)); }, 5000);
  }).catch(console.error));

  if (path === 'feedItems') {
    postsList.innerHTML = Object.values(value).map((item) => `<li class="list-group-item d-flex justify-content-between align-items-start border-0 border-end-0"><a href="${item.link}" class="fw-bold" id="${item.id}" target="_blank" >${item.title}</a><button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#modal" data-id="${item.id}">${i18nextInstance.t('OPEN')}</button></li>`).join('');
    postsHeader.hidden = false;
  }

  if (path === 'feedSources') {
    feedsList.innerHTML = Object.values(value).map((item) => `<li class="list-group-item border-0 border-end-0"><h3 class="h6 m-0">${item.title}</h3><p class="m-0 small text-black-50">${item.description}</p></li>`).join('');
    feedsHeader.hidden = false;

    initModal(state.feedItems);
  }

  if (path === 'loading') {
    feedInput.disabled = value;
    formSubmitButton.disabled = value;
  }

  if (path === 'inputValue') {
    resetInputValidityView();
    formValidationSchema.validate({ inputValue: value }).then(() => {
      watchedObject.loading = true;
      return updateFeed(value);
    }).catch((err) => {
      if (err.code === 'ERR_NETWORK') {
        return Promise.reject(err.code);
      }

      if (err?.errors) {
        return Promise.reject(err.errors[0]);
      }
      return Promise.reject(err.message);
    })
      .catch(((err) => {
        resetInputValidityView('error', err);
        watchedObject.loading = false;
      }));
  }
});
