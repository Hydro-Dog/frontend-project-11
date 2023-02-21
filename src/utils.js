import { ALL_ORIGINS_URL } from './constants.js';

export const addProxy = (url) => {
  const params = new URLSearchParams();
  params.set('disableCache', true);
  params.set('url', url);
  return new URL(`${ALL_ORIGINS_URL}/get?${params.toString()}`).toString();
};

export const prepareFeed = (value) => ({
  feed: { ...value.feed, id: value.feed.title },

  items: value.items ? value.items?.map((item) => ({
    ...item,
    id: item.title,
  })) : [],
});

export const generateFeedItemLinkNode = (isRead) => {
  const aNode = document.createElement('a');
  aNode.classList.add(isRead ? 'fw-normal' : 'fw-bold');
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
