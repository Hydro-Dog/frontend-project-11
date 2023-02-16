import axios from 'axios';
import { addProxy } from './utils.js';

const getFeed = (url) => axios.get(addProxy(url)).then((response) => {
  if (!response.status !== 200) {
    return response.data.contents;
  }
  throw new Error('URL_NO_DATA_VALIDATION_ERROR');
});

export default getFeed;
