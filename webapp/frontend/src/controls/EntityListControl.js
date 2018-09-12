import $ from 'jquery';
import select2 from 'select2';
import 'select2/dist/css/select2.css';
import BaseListControl from './BaseListControl.js';

export default class EntityListControl extends BaseListControl {
    constructor(typeControl) {
        super();
        this.draw();
        this.types = typeControl;
    }

    get value() {
        return this.$select2.val();
    }

    _processResults(data) {
        let results = data.map( (result) => {
            return {
                text: result._id,
                children: result.values
                    .sort((a,b)=>{
                        if(a.text>b.text)
                            return 1;
                        if(a.text>b.text)
                            return -1;
                        return 0;
                    })
                    .map( (value, idx) => {
                    return {
                        id: value.text,
                        text: value.text,
                        count: value.count
                    }
                })
            }
        });
        return {
            results: results
        }
    }

    _templateResult(p) {
       let count = p.count ? ' ('+p.count+')' : '';
       return '<span>'+ p.text + count + '</span>';
    }
    
    _templateSelection(p) {
       return '<span>'+ p.text + ' (' + p.count + ')</span>';
    }

    draw() {
        let that = this;
        that.$select2 = $('#entity-list').select2({
            ajax: {
                url: that.url + '/entities',
                dataType: 'json',
                delay: 250,
                cache: false,
                processResults: that._processResults,
                data: function (term) {
                  return {
                      term: term.term,
                      eTypes: that.types.value,
                      lang:['en']
                  };
                },
            },
            placeholder: 'Entities',
            escapeMarkup: (markup) => { return markup; }, // let our custom formatter work
            //minimumInputLength: 2,
            templateResult: that._templateResult,
            templateSelection: that._templateSelection,
            multiple: true,
            width: "20%",
            theme: "classic",
            allowClear: true,
            closeOnSelect: false
        });
    }
}
