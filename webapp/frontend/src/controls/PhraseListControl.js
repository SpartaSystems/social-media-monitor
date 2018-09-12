import $ from 'jquery';
import select2 from 'select2';
import 'select2/dist/css/select2.css';
import BaseListControl from './BaseListControl.js';

export default class PhraseListControl extends BaseListControl {
    constructor() {
        super();
        this.draw()
    }

    get value() {
        return this.$select2.val();
    }

    _processResults(data) {
        let results = data.map((d, idx)=>{return {text:d.text, id:d.text, count:d.count}});
        return {
            results: results
        }
    }

    _templateResult(p) {
        return '<span>'+ p.text + ' (' + p.count + ')</span>';
    }

    _templateSelection(p) {
        return '<span>'+ p.text + ' (' + p.count + ')</span>'
    }

    draw() {
        let that = this;
        that.$select2 = $('#phrase-list').select2({
            ajax: {
                url: this.url + '/phrases',
                dataType: 'json',
                delay: 250,
                cache: true,
                processResults: that._processResults,
                data: function (term) {
                  return {
                      term: term.term,
                      lang:['en']
                  };
                },
            },
            placeholder: 'Phrases',
            escapeMarkup: (markup) => { return markup; }, // let our custom formatter work
            minimumInputLength: 2,
            templateResult: that._templateResult,
            templateSelection: that._templateSelection,
            multiple: true,
            width: '20%',
            theme: "classic",
            allowClear: true,
            closeOnSelect: false
        });
    }
}
