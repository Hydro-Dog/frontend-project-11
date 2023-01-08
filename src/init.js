import i18next from 'i18next';
import onChange from 'on-change';
import * as yup from 'yup';
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
      inputValue: '',
      feedsUrls: [],
      lang: 'ru'
    };

    const feedForm = document.getElementById('rss-feed-form');
    const feedInput = document.getElementById('rss-feed-input');
    const feedInputLabel = document.getElementById('input-label');
    const inputValidationErrorDiv = document.getElementById('validation-error');
    const formSubmitButton = document.getElementById('form-submit');
    

    feedInputLabel.innerHTML = i18nextInstance.t('INPUT_LABEL');
    formSubmitButton.innerHTML = i18nextInstance.t('SUBMIT');

    const schema = yup.object().shape({
      inputValue: yup.string()
        .url('URL_VALIDATION_ERROR')
        .test('value-duplicate', 'VALUE_DUPLICATE_ERROR', (value) => state.feedsUrls.every((source) => value !== source))
        .required('REQUIRED_VALIDATION_ERROR'),
    });

    const watchedObject = onChange(state, (path, value, previousValue, applyData) => {
      console.log('state: ', state);
      // console.log('this:', this);
      // console.log('path:', path);
      // console.log('value:', value);
      // console.log('previousValue:', previousValue);
      // console.log('applyData:', applyData);

      if (path === 'inputValue') {
        schema.validate({ inputValue: value }).then(() => {
          //--------------
          feedInput.classList.add('is-valid');
          feedInput.classList.remove('is-invalid');
          inputValidationErrorDiv.classList.add('valid-feedback');
          inputValidationErrorDiv.classList.remove('invalid-feedback');
          inputValidationErrorDiv.innerHTML = '';
          //-------------

          state.feedsUrls.push(value);
          state.inputValue = '';
          feedForm.reset();
        }).catch((err) => {
          console.log('err.errors: ', err.errors);
          // state.inputError = err.errors[0]
          // inputValidationErrorDiv.innerHTML = err.errors[0];
          inputValidationErrorDiv.innerHTML = i18nextInstance.t(err.errors[0])
          feedInput.classList.add('is-invalid');
          feedInput.classList.remove('is-valid');
          inputValidationErrorDiv.classList.add('invalid-feedback');
          inputValidationErrorDiv.classList.remove('valid-feedback');
        });
      }

      if (path === 'inputError') {
        // console.log('inputValidationErrorDiv.innerHTML: ', inputValidationErrorDiv.innerHTML)
        inputValidationErrorDiv.innerHTML = value;
      }
    });

    feedForm.addEventListener('submit', (e) => {
      e.preventDefault();
      // console.log('event: ', e)
      // console.log('feedInput.value: ', feedInput.value)
      watchedObject.inputValue = feedInput.value;
    });
  });
};

// resources[lang].translation.COUNT_zero
// resources[lang].translation.COUNT_one
// resources[lang].translation.COUNT_two
// resources[lang].translation.COUNT_many
