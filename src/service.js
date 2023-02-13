import axios from 'axios';
import { addProxy } from './utils.js';

const getFeed = (url) => axios.get(addProxy(url)).then((response) => {
  if (!response.data?.status?.error && response.data?.contents) {
    return response.data.contents;
  }
  throw new Error('URL_NO_DATA_VALIDATION_ERROR');
});

export default getFeed;
