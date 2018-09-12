import axios from 'axios';
import BaseService from './BaseService.js';

export default class EntityTypesService extends BaseService {
		get() {
	      return axios.get(this.url + '/entityTypes');
	  }
}
