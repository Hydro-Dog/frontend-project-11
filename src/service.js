import axios from 'axios';
import { addProxy } from './utils.js';

const getFeed = (url) => axios.get(addProxy(url))
  .then((response) => response.data.contents).catch((error) => {
    throw new Error(error);
  });

export default getFeed;
