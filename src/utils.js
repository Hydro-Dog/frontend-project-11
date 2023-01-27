export const generateId = (value) => btoa(unescape(encodeURIComponent(value))).slice(0, 20);

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

export const setIds = (value) => ({
  feed: { ...value.feed, id: value.feed.title },

  items: value.items?.map((item) => ({
    ...item,
    id: item.title,
  })),
});
