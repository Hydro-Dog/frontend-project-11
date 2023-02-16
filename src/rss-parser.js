const rssToDomNode = (content) => new DOMParser().parseFromString(content, 'text/xml');

const parse = (data) => {
  const parserError = data.querySelector('parsererror');

  if (parserError) {
    throw new Error('URL_NO_DATA_VALIDATION_ERROR');
  }
  const title = data.querySelector('title')?.innerHTML;
  const description = data.querySelector('description')?.innerHTML;
  const link = data.querySelector('link')?.innerHTML;
  const items = Array.prototype.map.call(data.querySelectorAll('item'), (item) => ({
    title: item.querySelector('title')?.innerHTML,
    description: item.querySelector('description')?.innerHTML,
    link: item.querySelector('link')?.innerHTML,
  }));
  const feed = {
    title, description, link,
  };

  return { feed, items };
};

const parseRss = (content) => {
  const data = rssToDomNode(content);

  return parse(data);
};

export default parseRss;
