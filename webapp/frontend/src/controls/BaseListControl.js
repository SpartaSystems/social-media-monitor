import BaseService from '../services/BaseService.js';

export default class BaseListControl extends BaseService {
    constructor() {
        super();
        this.$select2 = { val: () => { } };
    }
}
