import axios from 'axios';
import ALL_ORIGINS_URL from './constants.js';
import { parseRssResponse } from './utils.js';

export const getFeed = (url) => axios.get(`${ALL_ORIGINS_URL}/get?disableCache=true&url=${encodeURIComponent(url)}`).then((response) => parseRssResponse(response));
