const rssToDomNode = (content) => new window.DOMParser().parseFromString(content, 'text/xml');

const parse = (data, feedId) => {
  const title = data.querySelector('title').innerHTML;
  const description = data.querySelector('description').innerHTML;
  const link = data.querySelector('link').innerHTML;
  const id = encodeURIComponent(title).slice(0, 19);
  const items = Array.prototype.map.call(data.querySelectorAll('item'), (item) => parse(item, id));

  return items.length ? {
    feed: {
      title, description, link, id,
    },
    items,
  } : {
    title, description, link, feedId, id,
  };
};

export const parseRss = (content) => {
  const data = rssToDomNode(content);

  return parse(data);
};
