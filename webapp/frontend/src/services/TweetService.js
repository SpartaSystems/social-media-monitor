import axios from 'axios';
import BaseService from './BaseService.js';

export default class TweetService extends BaseService {
		get(options) {
	      return axios.post(this.url + '/tweets', options);
	  }
}
