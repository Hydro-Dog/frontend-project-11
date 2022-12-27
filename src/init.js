import i18next from 'i18next';
import resources from '../locales/index.js';

// Начальная функция
export default () => {
  // создание экземпляра i18next
  const i18nextInstance = i18next.createInstance();
  i18nextInstance.init({
    lng: 'ru',
    resources: {
      ru: resources.ru,
      en: resources.en,
    },
  }).then(() => {
    const state = {
      /* описание состояния */
    };

    const feedForm = document.getElementById('rss-feed-form');
    const feedInput = document.getElementById('rss-feed-input');

    console.log('feedForm: ', feedForm)

    feedForm.addEventListener('submit', (e) => {
      e.preventDefault();
      console.log(feedInput.value);
      feedForm.reset();
    });
  });
};

// resources[lang].translation.COUNT_zero
// resources[lang].translation.COUNT_one
// resources[lang].translation.COUNT_two
// resources[lang].translation.COUNT_many
