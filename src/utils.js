import { ALL_ORIGINS_URL } from './constants.js';

export const generateId = (value) => btoa(unescape(encodeURIComponent(value))).slice(0, 20);

export const addProxy = (url) => `${ALL_ORIGINS_URL}/get?disableCache=true&url=${encodeURIComponent(url)}`;

export const parseRssResponse = (response) => {
  if (!response.data?.status?.error && response.data?.contents) {
    return response.data.contents;
  }
  throw new Error('URL_NO_DATA_VALIDATION_ERROR');
};

export const shouldUpdateFeedItems = (items, stateItems) => {
  for (let i = 0; i < items.length; i += 1) {
    if (stateItems[items[i].id]) {
      return false;
    }
  }
  return true;
};

export const prepareFeed = (value) => ({
  feed: { ...value.feed, id: value.feed.title },

  items: value.items?.map((item) => ({
    ...item,
    isRead: false,
    id: item.title,
  })),
});

export const generateFeedItemLinkNode = () => {
  const aNode = document.createElement('a');
  aNode.classList.add('fw-bold');
  aNode.target = '_blank';
  return aNode;
};

export const generateFeedItemLiNode = () => {
  const liNode = document.createElement('li');
  liNode.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start', 'border-0', 'border-end-0');
  return liNode;
};

export const generateFeedItemButtonNode = () => {
  const buttonNode = document.createElement('button');
  buttonNode.type = 'button';
  buttonNode.classList.add('btn', 'btn-primary');
  buttonNode.dataset.bsToggle = 'modal';
  buttonNode.dataset.bsTarget = '#modal';
  return buttonNode;
};

export const generateFeedSourceLiNode = () => {
  const liNode = document.createElement('li');
  liNode.classList.add('list-group-item', 'border-0', 'border-end-0');
  return liNode;
};

export const generateFeedSourceHeaderNode = () => {
  const headerNode = document.createElement('h3');
  headerNode.classList.add('h6', 'm-0');
  return headerNode;
};

export const generateFeedSourceParNode = () => {
  const parNode = document.createElement('p');
  parNode.classList.add('m-0', 'text-black-50', 'small');
  return parNode;
};
