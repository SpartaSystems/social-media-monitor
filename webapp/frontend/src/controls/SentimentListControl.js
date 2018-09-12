import $ from 'jquery';
import select2 from 'select2';
import 'select2/dist/css/select2.css';
import BaseListControl from './BaseListControl.js';

export default class SentimentListControl extends BaseListControl {
    constructor() {
        super();
        this.draw();
    }

    get value() {
        return this.$select2.val();
    }

    draw() {
        this.$select2 = $('#sentiment-list').select2({
            data: [
              { id: 'POSITIVE', text: 'Positive' },
              { id: 'NEUTRAL',  text: 'Neutral'  },
              { id: 'NEGATIVE', text: 'Negative' },
              { id: 'MIXED',    text: 'Mixed'    }
            ],
            multiple:true,
            placeholder:'Sentiment',
            width:'20%',
            theme: "classic",
            allowClear: true,
            closeOnSelect: false
        });
    }
}
