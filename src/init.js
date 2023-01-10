// import i18next from 'i18next';
import resources from '../locales/index.js';
import { watchedObject } from './view.js';
import { i18nextInstance } from './i18n.js';

// export const i18nextInstance = i18next.createInstance();

// Начальная функция
export default () => {
  i18nextInstance.init({
    lng: 'en',
    resources: {
      ru: resources.ru,
      en: resources.en,
    },
  }).then(() => {
    const feedForm = document.getElementById('rss-feed-form');
    const feedInput = document.getElementById('rss-feed-input');
    const feedInputLabel = document.getElementById('input-label');
    const formSubmitButton = document.getElementById('form-submit');
    const exampleBlock = document.getElementById('example-block');
    const feedsHeader = document.getElementById('feeds-header');
    const postsHeader = document.getElementById('posts-header');

    feedInputLabel.innerHTML = i18nextInstance.t('INPUT_LABEL');
    formSubmitButton.innerHTML = i18nextInstance.t('SUBMIT');
    exampleBlock.innerHTML = `${i18nextInstance.t('EXAMPLE')}https://ru.hexlet.io/lessons.rss`;
    feedsHeader.innerHTML = i18nextInstance.t('FEEDS');
    postsHeader.innerHTML = i18nextInstance.t('POSTS');

    feedForm.addEventListener('submit', (e) => {
      e.preventDefault();
      watchedObject.inputValue = feedInput.value;
    });
  });
};

// resources[lang].translation.COUNT_zero
// resources[lang].translation.COUNT_one
// resources[lang].translation.COUNT_two
// resources[lang].translation.COUNT_many
