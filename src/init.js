// import i18next from 'i18next';
import resources from '../locales/index.js';
import {
  watchedObject, feedForm,
  feedInput,
  feedInputLabel,
  formSubmitButton,
  exampleBlock,
  feedsHeader,
  postsHeader,
  postsList,
  closeModalButton,
} from './view.js';
import { i18nextInstance } from './i18n.js';

const initTexts = () => {
  feedInputLabel.innerHTML = i18nextInstance.t('INPUT_LABEL');
  formSubmitButton.innerHTML = i18nextInstance.t('SUBMIT');
  exampleBlock.innerHTML = `${i18nextInstance.t('EXAMPLE')}https://ru.hexlet.io/lessons.rss`;
  feedsHeader.innerHTML = i18nextInstance.t('FEEDS');
  postsHeader.innerHTML = i18nextInstance.t('POSTS');
  closeModalButton.innerHTML = i18nextInstance.t('CLOSE');
};

export default () => {
  i18nextInstance.init({
    lng: 'ru',
    resources: {
      ru: resources.ru,
      en: resources.en,
    },
  }).then(() => {
    initTexts();
    feedForm.addEventListener('submit', (event) => {
      event.preventDefault();
      watchedObject.inputValue = feedInput.value;
    });

    postsList.addEventListener('click', (event) => {
      if (event.target.tagName === 'A') {
        watchedObject.visitedPosts.unshift(event.target.id);
      }
    });
  }).catch(console.error);
};

// resources[lang].translation.COUNT_zero
// resources[lang].translation.COUNT_one
// resources[lang].translation.COUNT_two
// resources[lang].translation.COUNT_many
