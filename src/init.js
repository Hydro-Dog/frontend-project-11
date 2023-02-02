import onChange from 'on-change';
import * as yup from 'yup';
import resources from '../locales/index.js';
import i18nextInstance from './i18n.js';
import parseRss from './rss-parser.js';
import { shouldUpdateFeedItems, setIds } from './utils.js';
import { getFeed } from './service.js';
import {
  getDomNodesRefs,
  render,
} from './render.js';

const initState = () => ({
  inputValue: '',
  feedsUrls: [],
  feedSources: [],
  feedItems: [],
  lang: 'ru',
  inputState: 'none', // none, filling, sending, finished, failed
  inputMessage: '',
  visitedPosts: [],
  timers: [],
});

export default () => {
  i18nextInstance.init({
    lng: 'ru',
    resources: {
      ru: resources.ru,
      en: resources.en,
    },
  }).then(() => {
    const domElements = getDomNodesRefs();
    const {
      feedInputLabel,
      formSubmitButton,
      exampleBlock,
      feedsHeader,
      postsHeader,
      closeModalButton,
      feedForm,
      postsList,
    } = domElements;

    feedInputLabel.innerHTML = i18nextInstance.t('INPUT_LABEL');
    formSubmitButton.innerHTML = i18nextInstance.t('SUBMIT');
    exampleBlock.innerHTML = `${i18nextInstance.t('EXAMPLE')}https://ru.hexlet.io/lessons.rss`;
    feedsHeader.innerHTML = i18nextInstance.t('FEEDS');
    postsHeader.innerHTML = i18nextInstance.t('POSTS');
    closeModalButton.innerHTML = i18nextInstance.t('CLOSE');

    const state = initState();

    const watchedState = onChange(state, render(domElements, i18nextInstance));

    const refreshFeeds = (feedUrls) => {
      state.timers.forEach(clearTimeout);
      const refreshRequests = feedUrls.map((item) => getFeed(item));

      Promise.all(refreshRequests).then((feeds) => {
        feeds.forEach(() => {
          const id = setTimeout(() => { refreshFeeds(feedUrls); }, 5000);
          state.timers = [...state.timers, id];
        });
      });
    };

    const setInputValue = (value) => { watchedState.inputValue = value; };
    const setFeedsUrls = (value) => { watchedState.feedsUrls = value; };
    const setFeedSources = (value) => { watchedState.feedSources = value; };
    const setFeedItems = (value) => { watchedState.feedItems = value; };
    const setInputState = (value) => { watchedState.inputState = value; };
    const setInputMessage = (value) => { watchedState.inputMessage = value; };
    const setVisitedPosts = (value) => { watchedState.visitedPosts = value; };

    const setFeed = (content, feedUrl, shouldUpdateInputState = true) => {
      try {
        const rawData = parseRss(content);
        const feeds = setIds(rawData);

        if (shouldUpdateFeedItems(feeds.items, state.feedItems)) {
          setFeedItems({
            ...state.feedItems,
            ...feeds.items.reduce((acc, item) => ({ ...acc, [item.title]: item }), {}),
          });
        }

        if (!state.feedSources[feeds.feed.id]) {
          setFeedSources({
            ...state.feedSources,
            [feeds.feed.id]: feeds.feed,
          });
        }

        if (!state.feedsUrls.includes(feedUrl)) {
          setFeedsUrls([...state.feedsUrls, feedUrl]);
          refreshFeeds(state.feedsUrls);
        }

        if (shouldUpdateInputState) {
          setInputState('finished');
          setInputMessage('SUCCESS');
          setInputValue('');
        }
      } catch (error) {
        throw new Error(error.message);
      }
    };

    const validate = (urls) => yup.object().shape({
      inputValue: yup.string()
        .url('URL_VALIDATION_ERROR')
        .test('value-duplicate', 'VALUE_DUPLICATE_ERROR', (value) => urls.every((source) => value !== source))
        .required('REQUIRED_VALIDATION_ERROR'),
    });

    feedForm.addEventListener('submit', (event) => {
      const formData = new FormData(event.target);
      const url = formData.get('feedValue');
      setInputValue(url);
      event.preventDefault();
      validate(watchedState.feedsUrls).validate({ inputValue: url }).then(() => {
        setInputState('sending');

        return Promise.all([Promise.resolve(url), getFeed(url)]);
      }).then(([feedUrl, content]) => {
        setFeed(content, feedUrl);
        // refreshFeed(feedUrl);
      })
        .then(() => {
        })
        .catch((err) => {
          if (err.code === 'ERR_NETWORK') {
            setInputMessage(err.code);
          } else {
            setInputMessage(err.message);
          }

          setInputState('failed');
        });
    });

    postsList.addEventListener('click', (event) => {
      if (event.target.tagName === 'A') {
        setVisitedPosts([event.target.id, ...watchedState.visitedPosts]);
      }
    });
  });
};
