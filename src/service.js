import axios from 'axios';
import { addProxy } from './utils.js';

const getFeed = (url) => axios.get(addProxy(url));

export default getFeed;
