import $ from 'jquery';
import select2 from 'select2';
import 'select2/dist/css/select2.css';
import EntityTypesService from '../services/EntityTypesService.js';
import BaseListControl from './BaseListControl.js';

export default class EntityTypeListControl extends BaseListControl {
    constructor() {
        super();
        this.draw();
    }

    get value() {
        return this.$select2.val();
    }

    _processResults(data) {
        let results = data.map((d)=>{return {text:d, id:d}});
        return {
            results: results
        }
    }

    _templateResult(p) {
       return '<span>'+ p.text+ '</span>';
    }
    
    _templateSelection(p) {
       return '<span>'+ p.text + '</span>';
    }

    draw() {
        let that = this;
        new EntityTypesService().get()
        .then((response)=>{

            let options = response.data.map((d)=>{
                return { id: d, text: d };
            });

            that.$select2 = $('#entity-type-list').select2({
                data:options,
                placeholder: 'Entity Types',
                multiple:true,
                width:'20%',
                theme: "classic",
                allowClear: true,
                closeOnSelect: false
            })   
        })
        .catch((error)=>{
            console.error(error);
        });
    }
}
