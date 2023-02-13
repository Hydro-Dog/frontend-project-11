import onChange from 'on-change';
import * as yup from 'yup';
import resources from '../locales/index.js';
import i18nextInstance from './i18n.js';
import parseRss from './rss-parser.js';
import { prepareFeed } from './utils.js';
import getFeed from './service.js';
import {
  getDomNodesRefs,
  render,
  initTranslations,
} from './render.js';
import { TIMEOUT } from './constants.js';

const initState = () => ({
  feedsUrls: [],
  feedSources: [],
  feedItems: [],
  lang: 'ru',
  feedUrlUploadState: 'none', // none, filling, sending, finished, failed
  inputMessage: '',
  timers: [],
  modalData: { title: '', description: '', link: '' },
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
      modal,
      feedForm,
      postsList,
    } = domElements;

    const state = initState();

    initTranslations(domElements, i18nextInstance);
    const watchedState = onChange(state, render(domElements, i18nextInstance));

    const pushNewFeedItems = (feedItems) => {
      const newFeedItems = {};
      Object.entries(feedItems).forEach(([key, value]) => {
        if (!state.feedItems[key]) {
          newFeedItems[key] = value;
        }
      });

      watchedState.feedItems = { ...state.feedItems, ...newFeedItems };
    };

    const refreshFeeds = () => {
      const refreshRequests = state.feedsUrls.map((item) => getFeed(item));

      Promise.all(refreshRequests).then((feeds) => {
        feeds.forEach((feed) => {
          const rawData = parseRss(feed);
          const preparedFeed = prepareFeed(rawData);
          const feedItems = preparedFeed
            .items.reduce((acc, item) => ({ ...acc, [item.title]: item }), {});
          pushNewFeedItems(feedItems);
        });

        setTimeout(() => {
          refreshFeeds();
        }, TIMEOUT);
      });
    };

    refreshFeeds();

    const validate = () => yup.object().shape({
      inputValue: yup.string()
        .url('URL_VALIDATION_ERROR')
        .notOneOf(state.feedsUrls, 'VALUE_DUPLICATE_ERROR')
        .required('REQUIRED_VALIDATION_ERROR'),
    });

    modal.addEventListener('show.bs.modal', (event) => {
      const button = event.relatedTarget;
      const id = button.getAttribute('data-id');
      const post = state.feedItems[id];
      post.isRead = true;
      watchedState.feedItems = { ...state.feedItems, [id]: post };
      watchedState.modalData = {
        title: post.title,
        description: post.description,
        link: post.link,
      };
    });

    postsList.addEventListener('click', (event) => {
      if (event.target.nodeName === 'A') {
        const { id } = event.target;
        const post = state.feedItems[id];
        post.isRead = true;
        watchedState.feedItems = { ...state.feedItems, [id]: post };
        watchedState.modalData = {
          title: post.title,
          description: post.description,
          link: post.link,
        };
      }
    });

    feedForm.addEventListener('submit', (event) => {
      const formData = new FormData(event.target);
      const url = formData.get('feedValue');
      event.preventDefault();

      validate(watchedState.feedsUrls).validate({ inputValue: url }).then(() => {
        watchedState.feedUrlUploadState = 'sending';

        return getFeed(url);
      }).then((content) => {
        const rawData = parseRss(content);
        const feeds = prepareFeed(rawData);
        watchedState.feedItems = {
          ...state.feedItems,
          ...feeds.items.reduce((acc, item) => ({ ...acc, [item.title]: item }), {}),
        };

        watchedState.feedSources = {
          ...state.feedSources,
          [feeds.feed.id]: feeds.feed,
        };
        watchedState.feedsUrls = [...state.feedsUrls, url];
        watchedState.feedUrlUploadState = 'finished';
        watchedState.inputMessage = 'SUCCESS';
      })
        .catch((err) => {
          if (err.code === 'ERR_NETWORK') {
            watchedState.inputMessage = err.code;
          } else {
            watchedState.inputMessage = err.message;
          }

          watchedState.feedUrlUploadState = 'failed';
        });
    });
  });
};
